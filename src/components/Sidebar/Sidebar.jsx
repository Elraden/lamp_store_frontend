import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ categories, activeCategory, onCategoryChange }) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    onCategoryChange(category);
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.heading}>Категории</div>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.categoryButton} ${
            category === activeCategory ? styles.activeCategory : ""
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
