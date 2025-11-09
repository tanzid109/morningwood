import {  Categories } from '@/Pages/explore/Categories';
import Recomendend from '@/Pages/explore/Recomendend';
import GamingStreams from '@/Pages/Live/GamingStreams';
import IRL from '@/Pages/Live/IRL';
import LatestStreams from '@/Pages/Live/LatestStreams';
import React from 'react';

const page = () => {
    return (
        <div>
            <Categories/>
            <LatestStreams/>
            <GamingStreams/>
            <IRL/>
            <Recomendend/>
        </div>
    );
};

export default page;