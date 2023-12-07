export interface ArticleProps {
  title: string;
  date: string;
  imageUrl: string;
  content: React.ReactNode;
  tags: string[];
}

export const Article = ({
  title,
  date,
  imageUrl,
  content,
  tags,
}: ArticleProps) => {
  return (
    <div className="article">
      <div className="article-image">
        <div
          style={{
            width: "500px",
            height: "340px",
            backgroundPosition: "50%",
            backgroundSize: "cover",
            backgroundImage: `url('${imageUrl}')`,
          }}
        ></div>
      </div>
      <div className="article-content">
        <h2>
          {title}
          <span>{date}</span>
        </h2>
        {content}
        <div className="article-tags">
          {tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
