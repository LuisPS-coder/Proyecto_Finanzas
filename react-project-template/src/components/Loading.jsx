const Loading = ({ message = "Cargando..." }) => {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>{message}</h2>
      </div>
    );
  };
  
  export default Loading;
  