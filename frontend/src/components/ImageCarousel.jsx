import React, { useState } from "react";

const ImageCarousel = ({ images = [], height = "300px" }) => {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="carousel-wrapper">
      <div className="carousel-image">
        <img
          src={`http://localhost:8000/storage/${images[index].path}`}
          alt={`Slide ${index + 1}`}
          style={{
            width: "100%",
            height, // ← dynamic height
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
        {images.length > 1 && (
          <>
            <button className="carousel-btn left" onClick={prev}>←</button>
            <button className="carousel-btn right" onClick={next}>→</button>
          </>
        )}
      </div>
      <style>{`
        .carousel-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          font-size: 1.5rem;
          padding: 0.2rem 0.5rem;
          cursor: pointer;
        }
        .carousel-btn.left { left: 10px; }
        .carousel-btn.right { right: 10px; }
      `}</style>
    </div>
  );
};


export default ImageCarousel;
