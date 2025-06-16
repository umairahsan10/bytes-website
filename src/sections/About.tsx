"use client";
import { SectionHeader } from "@/components/SectionHeader"
import { Card } from "@/components/Card"
import javascriptIcon from "@/assets/icons/javascript.svg"
import htmlIcon from "@/assets/icons/html5.svg"
import cssIcon from "@/assets/icons/css3.svg"
import reactIcon from "@/assets/icons/react.svg"
import chromeIcon from "@/assets/icons/chrome.svg"
import githubIcon from "@/assets/icons/github.svg"
import mapImage from "@/assets/images/map.png"
import smilememoji from "@/assets/images/memoji-smile.png"
import { CardHeader } from "@/components/CardHeader"
import { ToolboxItems } from "@/components/ToolboxItems"
import Image from "next/image"
import bookImage from "@/assets/images/book-cover.png"
import {motion} from "framer-motion"
import { useRef } from "react"

const toolboxItems = [
    {
        title: "HTML", 
        iconType: htmlIcon,
    },
    {
        title: "CSS3",
        iconType: cssIcon,
    },
    {
        title: "React",
        iconType: reactIcon,
    },
    {
      title: "Javascript",
      iconType: javascriptIcon,
    },
    {
        title: "Chrome",
        iconType: chromeIcon,
    },
    {
        title: "Github",
        iconType: githubIcon,
    }
]

const hobbiesItems = [
    {
        title: "Painting",
        emoji: '🎨',
        left: '5%',
        top: '5%',
    },
    {
        title: "photography",
        emoji: '📸',
        left: '50%',
        top: '5%',
    },
    {
        title: "Gaming",
        emoji: '🎮',
        left: '10%',
        top: '35%',
    },
    {
        title: "hicking",
        emoji: '🥾',
        left: '35%',
        top: '40%',
    },
    {
        title: "Music",
        emoji: '🎵',
        left: '70%',
        top: '45%',
    },
    {
        title: "fitness",   
        emoji: '�',
        left: '5%',
        top: '65%',
    },
    {
        title: "Reading",
        emoji: '📚',
        left: '45%',
        top: '70%',
    },
]   
export const AboutSection = () => {
    const containerRef = useRef(null);
    return (
        <div id="about" className="py-20 lg:py-28">
            <div className="container">  
            <SectionHeader 
                eyebrow="About Me" 
                title="A Glimpse into my world" 
                description="Learn more about who I am, and what I do" 
            />
              <div className="mt20 flex flex-col gap-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:grid-cols-3">
                  <Card className="h-[320px] md:col-span-2 lg:col-span-1">
                      <CardHeader 
                          title="My Raads" 
                          description="explore the books shaping my perspectives" 
                      />
                      <div className="w-40 mx-auto mt-2 md:mt-0">
                          <Image src={bookImage} alt="book cover" />
                      </div>
                  </Card>
                  <Card className="h-[320px] md:col-span-3 lg:col-span-2">
                      <CardHeader 
                          title="My Toolbox" 
                          description="explore the tecnologies " 
                          className=""
                      />
                      <ToolboxItems items={toolboxItems} 
                       className="" 
                       itemsWrapperClassName="animate-move-left [animation-duration:20s] hover:[animation-play-state:paused]" /> 
                      <ToolboxItems 
                        items={toolboxItems} 
                        className="mt-6 "
                        itemsWrapperClassName="animate-move-right [animation-duration:20s] hover:[animation-play-state:paused]"
                      />
                  </Card>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:grid-cols-3">
                  <Card className="h-[320px] p-0 flex flex-col md:col-span-3 lg:col-span-2">
                      <CardHeader  
                          title="Beyond the code" 
                          description="explore the my interests and hobbies beyond the code" 
                          className="px-6 pt-6"
                      />
                          <div className="relative flex-1" ref={containerRef}>
                          {hobbiesItems.map(hobby => (
                              <motion.div 
                              key={hobby.title} className="inline-flex item-center gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute"
                              style={{
                                  left: hobby.left,
                                  top: hobby.top,
                              }}
                              drag
                              dragConstraints={containerRef}
                              >
                                  <span className="font-medium text-gray-950">{hobby.title}</span>
                                  <span>{hobby.emoji}</span>
                              </motion.div>
                          ))}
                      </div>
                  </Card>
                  <Card className="h-[320px] p-0 relative md:col-span-2 lg:col-span-1">
                      <Image src={mapImage} alt="map" className="w-full h-full object-cover object-left-top" 
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-gray-950/30">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-20 animate-ping [animation-duration:2s]"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-10"></div>
                          <Image src={smilememoji} alt="smilememoji" 
                          className="size-20" />
                      </div>
                  </Card>
                </div>
              </div>
            </div>
        </div>
    )
}