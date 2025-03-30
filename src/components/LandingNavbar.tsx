"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ThemeSelectorButton from './ThemeSelectorButton'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

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
                duration: 1,
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
                duration: 1,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 1,
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
            className="fixed left-1/2 -translate-x-1/2 z-50 w-[500px] max-w-7xl"
            style={{
                top: isScrolled ? 8 : 16,
                scale: isScrolled ? 0.98 : 1,
                transition: `top ${scrollTransition.duration}s ${scrollTransition.ease}, scale ${scrollTransition.duration}s ${scrollTransition.ease}`
            }}
        >
            <motion.div 
                className="bg-neutral-950/40 border border-neutral-800/50 backdrop-blur-md rounded-full h-[74px] shadow-lg shadow-black/10"
                style={{
                    backgroundColor: isScrolled ? 'rgba(10, 10, 13, 0.8)' : 'rgba(10, 10, 13, 0.4)',
                    transition: `background-color ${scrollTransition.duration}s ${scrollTransition.ease}`
                }}
            >
                <div className='relative flex justify-between h-full items-center px-8'>
                    <motion.div 
                        variants={itemVariants}
                        className="relative flex-shrink-0"
                    >
                        <svg width="108" height="25" viewBox="0 0 830 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M389.796 28.31V80.375C389.796 90.203 384.999 95 375.171 95H327.435V13.685H375.171C383.244 13.685 389.796 20.237 389.796 28.31ZM342.294 80.375H375.171V28.31H342.294V80.375ZM473.777 36.266V80.375C473.777 90.203 468.863 95 459.152 95H415.16C405.449 95 400.535 90.203 400.535 80.375V36.266C400.535 27.959 407.321 21.524 415.16 21.524H459.152C467.225 21.524 473.777 28.193 473.777 36.266ZM415.16 80.375H459.152V36.266H415.16V80.375ZM558.342 21.524V80.375C558.342 89.033 552.375 95 543.717 95H499.608C491.067 95 485.1 88.799 485.1 80.375V21.524H499.608V80.375H543.717V21.524H558.342ZM644.049 35.915V80.375C644.049 89.033 638.082 95 629.541 95H570.69V0.463997H585.315V21.524H629.541C637.029 21.524 644.049 27.959 644.049 35.915ZM585.315 80.375H629.541V36.266H585.315V80.375ZM670.671 0.463997V95H655.812V0.463997H670.671ZM740.673 65.516H697.032V80.375H751.554V95H697.032C688.491 95 682.524 88.682 682.524 80.375V36.149C682.524 27.608 687.789 21.524 697.032 21.524H740.673C749.214 21.524 755.181 27.725 755.181 36.149V50.891C755.181 59.666 749.331 65.516 740.673 65.516ZM697.032 50.891H740.673V36.149H697.032V50.891ZM390.03 159.708L389.796 176.556C389.679 186.852 386.052 192 375.288 192H327.435V110.685H375.288C385.35 110.685 389.679 115.599 389.679 125.31V139.35C389.679 145.551 387.807 148.125 383.01 149.529C387.807 150.465 390.03 153.39 390.03 159.708ZM342.06 141.807H375.288V125.31H342.06V141.807ZM342.06 177.375H375.288V155.496H342.06V177.375ZM468.861 133.266V148.008H454.119V133.266H416.328V192H401.703V118.524H454.119C463.947 118.524 468.861 123.438 468.861 133.266ZM550.21 133.266V192H491.476C482.935 192 476.851 185.799 476.851 177.375V162.633C476.851 154.092 482.935 148.008 491.476 148.008H535.468V133.266H476.851V118.524H535.468C544.126 118.524 550.21 124.725 550.21 133.266ZM491.476 177.375H535.468V162.633H491.476V177.375ZM632.427 177.375V192H576.15C566.439 192 561.525 187.203 561.525 177.375V133.266C561.525 124.959 566.439 118.524 576.15 118.524H632.427V133.266H576.15V177.375H632.427ZM671.71 154.209L715.351 192H692.887L656.383 159.942V192H641.758V97.464H656.383V148.827L691.951 118.524H714.181L671.71 154.209ZM775.407 162.516H731.766V177.375H786.288V192H731.766C723.225 192 717.258 185.682 717.258 177.375V133.149C717.258 124.608 722.523 118.524 731.766 118.524H775.407C783.948 118.524 789.915 124.725 789.915 133.149V147.891C789.915 156.666 784.065 162.516 775.407 162.516ZM731.766 147.891H775.407V133.149H731.766V147.891ZM829.704 177.375V192H814.962C806.421 192 800.337 185.799 800.337 177.375V97.698H814.962V118.524H829.704V132.096H814.962V177.375H829.704Z" fill="white" />
                            <path d="M230.404 104.466L166.464 184.747H207.383L274.5 104.466L207.383 26H166.464L230.404 104.466Z" fill="white" />
                            <path d="M44.0964 104.466L108.036 184.747H67.1173L0 104.466L67.1173 26H108.036L44.0964 104.466Z" fill="white" />
                        </svg>
                    </motion.div>
                    
                    <div id='navigation' className='flex justify-center gap-8'>
                        {['About', 'Pricing', 'Contact'].map((item, index) => (
                            <motion.div
                                key={item}
                                custom={index}
                                variants={itemVariants}
                                whileHover="hover"
                                className='text-white cursor-pointer hover:text-purple-400 transition-colors'
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                    
                    <motion.div 
                        variants={itemVariants}
                        className='flex items-center gap-4 flex-shrink-0'
                    >
                        <ThemeSelectorButton />
                        <Link href={'/sign-in'}>
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ 
                                    duration: 0.15, 
                                    ease: "easeOut" 
                                }}
                                className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                    Sign in
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default LandingNavbar