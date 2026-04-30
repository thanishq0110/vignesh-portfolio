import { useEffect, useState } from 'react';

/**
 * Tracks scroll proximity to the #projects section.
 * Returns `inWorksScene` (bool) — true once the section is >=10% visible.
 */
const useWorksScene = () => {
  const [inWorksScene, setInWorksScene] = useState(false);

  useEffect(() => {
    const target = document.getElementById('projects');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInWorksScene(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return inWorksScene;
};

export default useWorksScene;
