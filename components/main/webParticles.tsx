"use client"; 

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; 

const WebParticles = () => {
    const [init, setInit] = useState(false);


    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {

            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container) => {
        if (container) {
        }
        return Promise.resolve();
    };

    return (
        <>
            {init && (
                <Particles
                    className="absolute top-0 left-0 h-full w-full"
                    id="tsparticles"
                    particlesLoaded={particlesLoaded} 
                    options={{
                        background: {
                            color: {
                                value: "transparent", 
                            },
                        },
                        fullScreen: {
                            enable: false,
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: false,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: {}, 
                            },
                            modes: {
                                push: {
                                    quantity: 90,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#8cdcdd",
                            },
                            links: {
                                color: "#C2DDDB",
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            collisions: {
                                enable: true,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 1,
                                straight: false,
                            },
                            number: {
                                value: 200, 
                                density: {
                                    enable: true,
                                    // 
                                },
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </>
    );
};

export default WebParticles;
