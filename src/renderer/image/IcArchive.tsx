import React from "react";

interface Props {
  className?: string;
}

const IcArchive: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M26.4705 6.42385L24.733 4.32385C24.3955 3.89885 23.883 3.63635 23.2955 3.63635H8.29547C7.70797 3.63635 7.19547 3.89885 6.84547 4.32385L5.12047 6.42385C4.75797 6.84885 4.54547 7.41135 4.54547 8.01135V23.6364C4.54547 25.0114 5.67047 26.1364 7.04547 26.1364H24.5455C25.9205 26.1364 27.0455 25.0114 27.0455 23.6364V8.01135C27.0455 7.41135 26.833 6.84885 26.4705 6.42385ZM15.7955 21.7614L8.92047 14.8864H13.2955V12.3864H18.2955V14.8864H22.6705L15.7955 21.7614ZM7.19547 6.13635L8.20797 4.88635H23.208L24.383 6.13635H7.19547Z"
          fill="#BDBDBD"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IcArchive;
