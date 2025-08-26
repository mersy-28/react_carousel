import { useMemo, useState } from 'react';
import './Carousel.scss';

export interface CarouselProps {
  images: string[];
  itemWidth?: number;
  frameSize?: number;
  step?: number;
  animationDuration?: number;
  infinite?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  itemWidth = 130,
  frameSize = 3,
  step = 3,
  animationDuration = 1000,
}) => {
  const total = images.length;
  const safeFrameSize = useMemo(
    () => Math.min(Math.max(1, frameSize), total),
    [frameSize, total]
  );
  const safeStep = useMemo(
    () => Math.min(Math.max(1, step), total),
    [step, total]
  );

  const [index, setIndex] = useState<number>(0);

  const maxIndex = Math.max(0, total - safeFrameSize);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const goPrev = (): void => {
    if (!canPrev) return;
    setIndex((i) => Math.max(0, i - safeStep));
  };

  const goNext = (): void => {
    if (!canNext) return;
    setIndex((i) => Math.min(maxIndex, i + safeStep));
  };

  const framePx = safeFrameSize * itemWidth;
  const translatePx = -index * itemWidth;

  return (
    <div className="Carousel">
      <div className="Carousel__controls">
        <button
          type="button"
          className="button is-light"
          onClick={goPrev}
          disabled={!canPrev}
        >
          Prev
        </button>

        <button
          data-cy="next"
          type="button"
          className="button is-light"
          onClick={goNext}
          disabled={!canNext}
        >
          Next
        </button>
      </div>

      <div className="Carousel__frame" style={{ width: `${framePx}px`, overflow: 'hidden' }}>
        <ul
          className="Carousel__track"
          style={{
            display: 'flex',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            transform: `translateX(${translatePx}px)`,
            transition: `transform ${animationDuration}ms ease`,
          }}
        >
          {images.map((src, i) => {
            const visible = i >= index && i < index + safeFrameSize;
            return (
              <li
                key={`${src}-${i}`}
                style={{ width: `${itemWidth}px`, flex: '0 0 auto' }}
              >
                <img
                  src={src}
                  alt={`slide-${i + 1}`}
                  width={itemWidth}
                  style={{ visibility: visible ? 'visible' : 'hidden' }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Carousel;
