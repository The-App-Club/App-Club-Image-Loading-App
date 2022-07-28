import {useCallback, useEffect, useRef, useState} from 'react';
import data from '../data/dump.json';
import imagesLoaded from 'imagesloaded';
import {css, cx} from '@emotion/css';
import gsap from 'gsap';

const createImageDomFragment = ({data}) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    const item = createImageDom({url: data[i]});
    fragment.appendChild(item);
  }
  return fragment;
};

const createImageDom = ({url}) => {
  const item = document.createElement('div');
  const img = document.createElement('img');
  img.src = url;
  item.appendChild(img);
  return item;
};

const sleep = ({millSeconds}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millSeconds);
  });
};

const preloadImages = (imageDomContainer, data, watchProgress) => {
  return new Promise((resolve) => {
    const fragment = createImageDomFragment({data});
    imageDomContainer.current.insertBefore(
      fragment,
      imageDomContainer.current.firstChild
    );
    const instance = imagesLoaded(
      [...imageDomContainer.current.querySelectorAll('img')],
      {background: true}
    ); // https://imagesloaded.desandro.com/#events
    instance.on('progress', function (e) {
      // magic
      setTimeout(() => {
        watchProgress({
          progress: e.progressedCount / data.length,
          progressedCount: e.progressedCount,
          summaryCount: data.length,
        });
      }, 800);
    });
    instance.on('done', function (e) {
      resolve({done: true});
    });
  });
};

const Grid = ({gutter=`1rem`}) => {
  const imageDomContainer = useRef(null);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleResize = (e) => {
    // console.log(e);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const watchProgress = useCallback((e) => {
    // console.log(`watchProgress`, e);
    const {progress} = e;
    setProgress(progress);
  }, []);

  const niceCallback = useCallback((e) => {
    console.log(e);
  }, []);

  useEffect(() => {
    gsap.set(imageDomContainer.current, {
      y: 120,
      opacity: 0,
      visibility: 'hidden',
      display: 'none',
    });
    Promise.all([preloadImages(imageDomContainer, data, watchProgress)]).then(
      async ([e]) => {
        niceCallback(e);
        setDone(true);
        await sleep({millSeconds: 600});
        gsap.to(imageDomContainer.current, {
          y: 0,
          opacity: 1,
          visibility: 'visible',
          display: 'block',
        });
      }
    );
  }, []);

  return (
    <div>
      <h2
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        Hello
      </h2>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          p {
            font-size: 1.5rem;
          }
        `}
      >
        {done ? <p>done</p> : <p>{progress}</p>}
      </div>
      <div
        ref={imageDomContainer}
        className={cx(
          css`
            padding: ${gutter};
            opacity: 0;
            visibility: hidden;
            display: none;
            column-count: 6;
            column-gap: ${gutter};
            @media (max-width: 1400px) {
              column-count: 5;
              column-gap: ${gutter};
            }
            @media (max-width: 1200px) {
              column-count: 4;
              column-gap: ${gutter};
            }
            @media (max-width: 900px) {
              column-count: 3;
              column-gap: ${gutter};
            }
            @media (max-width: 768px) {
              column-count: 2;
              column-gap: ${gutter};
            }
            @media (max-width: 500px) {
              column-count: 1;
              column-gap: ${gutter};
            }
            div {
              padding-bottom: ${gutter};
              img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                width: 100%;
              }
            }
          `,
          ``
        )}
      ></div>
    </div>
  );
};
export {Grid};
