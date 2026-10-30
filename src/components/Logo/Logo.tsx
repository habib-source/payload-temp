import clsx from 'clsx'

interface Props {
  className?: string
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    /* eslint-disable @next/next/no-img-element */
    <svg
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 120 170 230"
      width="134"
      height="34"
    >
      <text
        x="-30"
        y="300"
        fontFamily="DejaVu Sans, Arial, Helvetica, sans-serif"
        fontSize="230"
        fontWeight="bolder"
        fill="currentColor"
        textAnchor="middle"
      >
        R
      </text>
      <rect x="-30" y="280" width="28" height="80" fill="#C9A227" />
      <rect x="10" y="260" width="28" height="110" fill="#C9A227" />
      <rect x="50" y="240" width="28" height="150" fill="#C9A227" />
      <text
        x="230"
        y="300"
        fontFamily="DejaVu Sans, Arial, Helvetica, sans-serif"
        fontSize="180"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
      >
        MC
      </text>
    </svg>
  )
}
