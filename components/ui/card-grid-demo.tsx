import React from 'react';
import { ArticleCardGrid } from '@/components/ui/card-grid'; // Adjust the import path as needed

const ArticleCardGridDemo = () => {
  // MediQ "What We Do" pillars (local assets instead of the sample stock photos)
  const articles = [
    {
      id: 1,
      imageSrc: 'assets/img/pillars/p1_cleanroom_inspect.jpg',
      title: 'Strategic Importation & Distribution',
      linkText: 'Find out more',
      linkHref: '#',
    },
    {
      id: 2,
      imageSrc: 'assets/img/pillars/p2_headquarters_brand.jpg',
      title: 'Product Marketing & Brand Development',
      linkText: 'Find out more',
      linkHref: '#',
    },
    {
      id: 3,
      imageSrc: 'assets/img/pillars/p3_specialist_discussion.jpg',
      title: 'Nationwide Clinical & Sales Coverage',
      linkText: 'Find out more',
      linkHref: '#',
    },
  ];

  return (
    <div className="flex items-center justify-center w-full bg-background">
      <ArticleCardGrid title="What We Do" articles={articles} />
    </div>
  );
};

export default ArticleCardGridDemo;

