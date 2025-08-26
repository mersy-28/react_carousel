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
  infinite = false,
}) => {
  const total = images.length;
  const safeFrameSize = useMemo(
    () => Math.min(Math.max(1, frameSize), total),
    [frameSize, total]
  );

  const [index, setIndex] = useState<number>(0);

  const maxIndex = Math.max(0, total - safeFrameSize);
  const canPrev = infinite ? true : index > 0;
  const canNext = infinite ? true : index < maxIndex;

  const goPrev = (): void => {
    if (infinite) {
      const nextIdx = (index - step) % total;
      setIndex((nextIdx + total) % total);
      return;
    }
    setIndex(i => Math.max(0, i - step));
  };

  const goNext = (): void => {
    if (infinite) {
      setIndex(i => (i + step) % total);
      return;
    }
    setIndex(i => Math.min(maxIndex, i + step));
  };

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

      <div
        className="Carousel__frame"
        style={{ width: `${safeFrameSize * itemWidth}px`, overflow: 'hidden' }}
      >
        <ul
          className="Carousel__track"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            gap: 0,
            transition: `transform ${animationDuration}ms ease`,
          }}
        >
          {images.map((src, i) => {
            const visible = i >= index && i < index + safeFrameSize;
            return (
              <li
                key={`${src}-${i}`}
                className="Carousel__item"
                style={{
                  width: `${itemWidth}px`,
                  flex: '0 0 auto',
                  display: visible ? 'block' : 'none',
                }}
              >
                <img src={src} alt={`slide-${i + 1}`} width={itemWidth} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Carousel;
