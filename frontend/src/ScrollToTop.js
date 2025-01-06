import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // Scrolls to the top of the page on route change
  }, [pathname]);  // Trigger when the route (pathname) changes

  return null;
}

export default ScrollToTop;