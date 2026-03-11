import { motion } from "framer-motion";

type ImageDisplayProps = {
  image: string;
  label: string;
  inProgress?: boolean;
};

export const ImageDisplay = ({
  image,
  label,
  inProgress,
}: ImageDisplayProps) => (
  <>
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-2">{label}</h2>
      {inProgress && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <motion.div
            style={{
              width: "48px",
              height: "48px",
              border: "5px solid #3b82f6",
              borderTopColor: "transparent",
              borderRightColor: "transparent",
              borderRadius: "50%",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}
      <img
        className="w-full h-full object-contain rounded hover:scale-200"
        src={image}
        alt={label}
      />
    </div>
  </>
);
