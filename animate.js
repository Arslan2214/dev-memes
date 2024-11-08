import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initializeAnimations = () => {
  gsap.from(".word", {
    y: -100,
    opacity: 0,
    rotation: "random(-80, 80)",
    duration: 0.7,
    ease: "back",
    stagger: 0.1,
  });

  const words = document.querySelectorAll(".word");
  const tom_meme_pic = document.getElementById("tom_meme_pic");

  const colors = [
    "#C084FC", // purple
    "#60A5FA", // blue
    "#4ADE80", // green
    "#FACC15", // yellow
    "#FB7185", // pink
    "#FB923C", // orange
    "#EF4444", // red
    "#818CF8", // indigo
    "#22D3EE", // cyan
    "#34D399", // emerald
    "#A78BFA", // violet
    "#FCD34D", // amber
    "#FB7185", // rose
    "#14B8A6", // teal
    "#E879F9", // fuchsia
  ];

  words.forEach((word, index) => {
    word.style.cursor = "pointer";

    word.addEventListener("mouseenter", () => {
      gsap.to(word, {
        color: colors[index % colors.length],
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    word.addEventListener("mouseleave", () => {
      gsap.to(word, {
        color: "white",
        scale: 1,
        duration: 0.3,
        ease: "power2.in",
      });
    });
  });

  gsap.to(tom_meme_pic, {
    scale: 1.1,
    duration: 0.3,
    ease: "power2.out",
    repeat: -1,
    yoyo: true,
  });

  gsap.fromTo(
    ".show-image",
    {
      scale: 0,
    },
    {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  const images = document.querySelectorAll(".img-scroll");

  images.forEach((img) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: "#hero-section",
        start: "12% 10%",
        end: "bottom 70%",
        scrub: true,
      },
      y: -100,
      yPercent: -100,
      opacity: 0.8,
      scale: 1.2,
    });
  });
};
