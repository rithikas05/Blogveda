import { useEffect } from "react";

function PageWrapper({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0); // Always scroll to top when page mounts
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#0f0f0f] text-darkText dark:text-white transition-colors duration-300">
      {children}
    </div>
  );
}

export default PageWrapper;
