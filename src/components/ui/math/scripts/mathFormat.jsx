
import Script from 'next/script';

const MathJaxComponent = () => {
    return (
        <>
            <Script 
                src="https://polyfill.io/v3/polyfill.min.js?features=es6" 
                strategy="beforeInteractive" 
            />
            <Script 
                id="MathJax-script" 
                async 
                src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" 
                strategy="afterInteractive" 
            />
        </>
    );
};

export default MathJaxComponent;