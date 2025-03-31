"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import ThemeSelectorButton from './ThemeSelectorButton'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { InteractiveHoverButton } from './magicui/interactive-hover-button'
import { hubotSans } from '@/app/page'

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollY } = useScroll()
    
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsScrolled(true)
        } else {
            setIsScrolled(false)
        }
    })

    const navVariants = {
        initial: {
            y: -20,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        initial: { opacity: 0, y: -8 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    }

    const scrollTransition = {
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.3
    }

    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={navVariants}
        className="fixed left-0 right-0 top-4 z-50 px-4 mx-auto shadow-2xl"
        style={{
          top: isScrolled ? 8 : 16,
          transition: `top ${scrollTransition.duration}s ${scrollTransition.ease}`,
        }}
      >
        <motion.div
          className="bg-neutral-950/40 border border-neutral-700/50 backdrop-blur-lg rounded-full h-[74px] shadow-lg shadow-black/10 w-[800px] mx-auto"
          style={{
            backgroundColor: isScrolled
              ? "rgba(10, 10, 13, 0.8)"
              : "rgba(10, 10, 13, 0.4)",
            transition: `background-color ${scrollTransition.duration}s ${scrollTransition.ease}`,
            transform: isScrolled ? "scale(0.98)" : "scale(1)",
            transformOrigin: "center top",
          }}
        >
          <div className="relative flex justify-between h-full items-center px-8">
            <motion.div
              variants={itemVariants}
              className="relative flex-shrink-0"
            >
              <svg
                width="30"
                height="39"
                viewBox="0 0 104 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="89" height="89" rx="28" fill="white" />
                <rect
                  x="15"
                  y="27"
                  width="89"
                  height="89"
                  rx="28"
                  fill="white"
                  style={{ mixBlendMode: "difference" }}
                />
              </svg>
            </motion.div>

            <div id="navigation" className={`flex justify-center gap-8 ${hubotSans.className}`}>
              {["About", "Pricing", "Contact"].map((item, index) => (
                <motion.div
                  key={item}
                  custom={index}
                  variants={itemVariants}
                  whileHover="hover"
                  className="text-white cursor-pointer hover:text-purple-400 transition-colors"
                >
                  {item}
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 flex-shrink-0"
            >
             {/* <ThemeSelectorButton /> */}
              <Link href={"/signin"}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    duration: 0.15,
                    ease: "easeOut",
                  }}
                  className="relative inline-flex overflow-hidden rounded-full"
                >
                  <InteractiveHoverButton className='w-30 h-10'>Sign In</InteractiveHoverButton>
                  {/* <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Sign in
                  </span> */}
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
}

export default LandingNavbar