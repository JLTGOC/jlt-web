import { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Box, Image, Stack, Text, Group, Divider } from "@mantine/core";
import {
  Article,
  Flight,
  LocalShipping,
  Language,
} from "@nine-thirty-five/material-symbols-react/rounded";
import classes from "./AuthCarousel.module.css";
import jlt from "@/assets/logos/jlt-matte-black.webp";
import worldMap from "@/assets/carousel/bg-splash.webp";
import slide1 from "@/assets/carousel/slide-1.webp";
import slide2 from "@/assets/carousel/slide-2.webp";
import slide3 from "@/assets/carousel/slide-3.webp";
import slide4 from "@/assets/carousel/slide-4.webp";

const SERVICES = [
  { Icon: Article, label: "CUSTOMS\nBROKERAGE" },
  { Icon: Flight, label: "FREIGHT\nFORWARDING" },
  { Icon: LocalShipping, label: "LOGISTICS\nSOLUTIONS" },
  { Icon: Language, label: "DOMESTIC &\nINTERNATIONAL\nSHIPPING" },
] as const;

const IMAGE_SLIDES = [slide1, slide2, slide3, slide4] as const;

// Sub-components
function BrandedSlide() {
  return (
    <Box
      h="100%"
      style={{
        background:
          "linear-gradient(180deg, #5190C3 0%, #0155A6 40%, #013B76 75%, #012B54 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* World map splash image */}
      <Image
        src={worldMap}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          opacity: 0.18,
          pointerEvents: "none",
          objectFit: "cover",
          objectPosition: "center bottom",
          transform: "translateY(25%)",
        }}
      />

      <Stack
        align="center"
        gap="xl"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Logo */}
        <Image
          src={jlt}
          fit="contain"
          style={{
            width: "clamp(130px, 16.6vw, 212px)",
            height: "auto",
          }}
        />

        {/* Company name */}
        <Stack gap={4} align="center" c="white" tt="uppercase" ta="center">
          <Text fw={700} fz="2.188rem" lh={1}>
            Jill L. Tolentino
          </Text>
          <Text fz="1.25rem" fw={500} style={{ letterSpacing: "0.281rem" }}>
            Group of Companies
          </Text>
        </Stack>

        {/* Divider */}
        <Divider w="8.625rem" color="#0072FF" size="md" />

        {/* Service icons */}
        <Group
          gap={"3.5rem"}
          align="flex-start"
          c="white"
          ta="center"
          tt="uppercase"
        >
          {SERVICES.map(({ Icon, label }) => (
            <Stack key={label} align="center" gap={8} style={{ maxWidth: 56 }}>
              <Icon width={22} style={{ color: "white" }} />
              <Text
                fz="0.813rem"
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.4,
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </Text>
            </Stack>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}

function ImageSlide({ image }: { image: string }) {
  return (
    <Box
      h="100%"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

// Main export
export default function AuthCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: false }));
  const fade = useRef(Fade());

  return (
    <Carousel
      height="100%"
      flex={1}
      withControls={false}
      withIndicators
      emblaOptions={{ loop: true }}
      plugins={[autoplay.current, fade.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      classNames={{
        indicators: classes.indicators,
        indicator: classes.indicator,
      }}
    >
      <Carousel.Slide>
        <BrandedSlide />
      </Carousel.Slide>

      {IMAGE_SLIDES.map((src) => (
        <Carousel.Slide key={src}>
          <ImageSlide image={src} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
