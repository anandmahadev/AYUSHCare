import React from 'react';
import ReactDOM from 'react-dom/client';
import { GradualBlur } from '../components/GradualBlur';

const rootElement = document.getElementById('gradual-blur-root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            {/* 
              Example: A fixed bottom blur to smooth out the transition 
              or an absolute blur overlay on specific sections.
              Here we position it absolutely within the container it is placed in.
            */}
            <GradualBlur
                direction="bottom"
                blur="10px"
                className="w-full h-32 bottom-0 z-10"
            />
        </React.StrictMode>
    );
}
