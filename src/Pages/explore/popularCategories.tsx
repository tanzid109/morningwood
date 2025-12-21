interface GameCard {
    title: string;
    viewers: string;
    imgSrc: string; 
}

export default function PopularCards(): GameCard[] {
    return [
        {
            title: "Just Chatting",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category1.png",
        },
        {
            title: "PUBG: BATTLEGROUNDS",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category2.png",
        },
        {
            title: "VALORANT",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category3.png",
        },
        {
            title: "APEX LEGENDS",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category4.png",
        },
        {
            title: "EA SPORTS FC 26",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category5.png",
        },
        {
            title: "Just Chatting",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category1.png",
        },
        {
            title: "PUBG: BATTLEGROUNDS",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category2.png",
        },
        {
            title: "VALORANT",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category3.png",
        },
        {
            title: "APEX LEGENDS",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category4.png",
        },
        {
            title: "EA SPORTS FC 26",
            viewers: "1.2 M watching",
            imgSrc: "/assets/category5.png",
        },
    ];
}