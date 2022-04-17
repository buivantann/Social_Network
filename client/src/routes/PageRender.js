import React from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../components/common/NotFound';
import { useSelector } from 'react-redux';

const generatePage = (pageName) => {
  const component = () => require(`../features/${pageName}`).default;

  try {
    return React.createElement(component());
  } catch (err) {
    return <NotFound />;
  }
};

const PageRender = () => {
  const { page, id } = useParams();
  const { auth } = useSelector((state) => state);

  let pageName = '';

  if (auth.token) {
    if (id) {
      pageName = `${page}/[id]`;
    } else {
      pageName = `${page}`;
    }
  }

  return generatePage(pageName);
};

export default PageRender;
