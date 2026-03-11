type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const PerlerButton = ({ label, onClick }: ButtonProps) => (
  <>
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={onClick}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#10b981",
          color: "white",
          borderRadius: "0.375rem",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {label}
      </button>
    </div>
  </>
);
