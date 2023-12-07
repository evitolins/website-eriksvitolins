import { useState } from "react";
import "./App.scss";
import { Article } from "./Article";
import { articles } from "./articles";

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

export const About = () => {
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter(({ title, content, tags }) => {
    const lowerSearch = search.toLowerCase();
    return (
      title.toLowerCase().includes(lowerSearch) ||
      content?.toString().toLowerCase().includes(lowerSearch) ||
      tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <>
      <div className="content-nav">
        <div>
          <input
            placeholder="Search keywords and tags here..."
            style={{ width: "25vw" }}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
          <br />
          {Boolean(search.length) && (
            <span className="input-label">
              {`${filteredArticles.length} matching ${
                filteredArticles.length === 1 ? "article" : "articles"
              }`}
            </span>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <span className="label">catagories </span>
          <div className="article-tags">
            {articles
              .map((article) => article.tags)
              .flat(1)
              .filter(onlyUnique)
              .sort()
              .map((tag) => (
                <span className={"tag"} key={tag}>
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="content">
        {filteredArticles.map((props) => (
          <Article key={props.title} {...props} />
        ))}
      </div>
    </>
  );
};
