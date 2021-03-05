import React, { useEffect, useRef, useState } from "react";
import { NavigationTree } from "../tree-view";

interface Props extends React.DOMAttributes<HTMLElement> {
  render: (data: NavigationTree[]) => JSX.Element
}

export function ScrollSpy(props: Props) {
  const parent = useRef<HTMLDivElement>();
  const sections = useRef<NodeListOf<HTMLElement>>();
  const [tree, setTree] = useState<NavigationTree[]>([]);
  const [activeElementId, setActiveElementId] = useState("");

  const setSections = () => {
    sections.current = parent.current.querySelectorAll("section");

    if (!sections.current.length) {
      throw new Error("No <section/> tag founded! Content should be placed inside <section></section> elements to activate navigation.");
    }
  };

  const updateNavigation = () => {
    setTree(getNavigation(sections.current[0].parentElement));
  };

  const getNavigation = (element: Element) => {
    const sections = element.querySelectorAll(":scope > section"); // Searching only direct children of an element. Impossible without :scope
    const children: NavigationTree[] = [];

    sections.forEach(section => {
      const id = section.getAttribute("id");
      const name = section.querySelector("h1, h2, h3, h4, h5, h6").textContent;
      const selected = id === activeElementId;

      if (!name || !id) {
        return;
      }

      children.push({
        id,
        name,
        selected,
        children: getNavigation(section)
      });
    });

    return children;
  };

  const handleIntersect = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setActiveElementId(entry.target.closest("section[id]").id);
    }
  };

  const observeSections = () => {
    const options: IntersectionObserverInit = {
      threshold: [0],
      rootMargin: "0px 0px -85%",
    };

    sections.current.forEach((section) => {
      const observer = new IntersectionObserver(handleIntersect, options);
      const target = section.querySelector("section") || section;

      observer.observe(target);
    });
  };

  useEffect(() => {
    setSections();
    observeSections();
    // TODO: Attach on dom change event
  }, []);

  useEffect(() => {
    updateNavigation();
  }, [activeElementId]);

  console.log(activeElementId);

  return (
    <div className="ScrollSpy" ref={parent}>
      {props.render(tree)}
    </div>
  );
}
