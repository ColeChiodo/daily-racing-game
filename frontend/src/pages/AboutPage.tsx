import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <>
        <div className="flex flex-col justify-center items-center w-2/5 mx-auto">
            {/* Author */}
            <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                <div className="flex flex-col">
                    <p className="text-black text-xl mt-4 font-bold">Author</p>
                    <p className="text-black my-4">
                        Hi, Im Cole Chiodo. A recent Computer Science Graduate with an interest in video games.<br />
                        Learn more on my <a href="http://colechiodo.cc" className="underline hover:text-gray-500">personal site</a>.
                    </p>
                </div>
            </div>

            {/* Project Description */}
            <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                <div className="flex flex-col">
                    <p className="text-black text-xl mt-4 font-bold">Project Description</p>
                    <p className="text-black my-4">
                        I decided to make this project while searching for a job to pass the time and improve my Software Engineering skills.

                    </p>
                </div>
            </div>

            {/* How I Made It */}
            <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                <div className="flex flex-col">
                    <p className="text-black text-xl mt-4 font-bold">How I Made It</p>
                    <p className="text-black my-4">
                        Daily Racing Game was created using a combination of tools and technologies, including:
                    </p>
                    <ul className="list-disc pl-4 text-black md:mx-16">
                        <li className="mb-2">Node and Express backend using TypeScript</li>
                        <li className="mb-2">React frontend</li>
                        <li className="mb-2">PostgreSQL database to store user accounts and ghost data</li>
                        <li className="mb-2">Gameplay rendering using HTML canvas element</li>
                    </ul>
                </div>
            </div>

            {/* Future Plans */}
            {/* <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                <div className="flex flex-col">
                    <p className="text-black text-xl mt-4 font-bold">Future Plans</p>
                    <p className="text-black my-4">
                        Looking ahead, I plan to continue working on this project incrementally. Some of the things I would like to include are:
                    </p>
                    <ul className="list-disc pl-6 text-black md:mx-16">
                        <li className="mb-2">Ranked Mode</li>
                        <li className="mb-2">VS AI Mode</li>
                        <li className="mb-2">Full Gamepad Support</li>
                        <li className="mb-2">Add Complexity and Depth</li>
                        <li className="mb-2">Steam Release (?)</li>
                    </ul>
                    <p className="text-black my-4">Stay tuned for updates!</p>
                </div>
            </div> */}

            {/* Credits */}
            {/* <div className="flex flex-col lg:flex-row w-full justify-center items-center">
                <div className="flex flex-col">
                    <p className="text-black text-xl font-bold">Credits</p>
                    <p className="text-black text-lg font-bold">Art:</p>
                    <p className="text-black my-4">
                        "MiniFolks - Humans" pixel art characters by LYASeeK -- https://lyaseek.itch.io/minifhumans
                    </p>
                    <p className="text-black my-4">
                        "Pixel Isometric: Village" tileset by Xilurus -- https://xilurus.itch.io/pixel-isometric-village
                    </p>
                    <p className="text-black my-4">
                        "Mountain Dusk Parallax" background by ansimuz -- https://ansimuz.itch.io/mountain-dusk-parallax-background
                    </p>
                    <p className="text-black my-4">"Free Sky Backgrounds" by CraftPix.net</p>
                    <p className="text-black my-4">"Nature Landscapes Free Pixel Art" by CraftPix.net</p>
                    <p className="text-black text-lg font-bold">Sounds:</p>
                    <p className="text-black my-4">
                        "step.wav" by _bepis -- https://freesound.org/s/423196/ -- License: Attribution 4.0
                    </p>
                </div>
            </div> */}
        </div>
    </>
  );
};

export default AboutPage;
