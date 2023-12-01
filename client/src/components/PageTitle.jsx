const PageTitle = ({ title, className }) => {
  return (
    <div>
      <h1 className={`${className} text-xl uppercase `}>{title}</h1>
    </div>
  );
};

export default PageTitle;
