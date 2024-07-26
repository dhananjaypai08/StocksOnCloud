import React, { useEffect, useRef, useState } from "react";
import { Chart } from "../components/Chart";
import { Watchlist} from "../components/Watchlist";
import { MarketBar } from "../components/MarketBar";
import { Trade } from "../components/Trade";
import {Appbar} from "../components/Appbar"

export const Home = () => {
    return (
        <div className="bg-black">
            <Appbar />
        <div className="flex flex-row flex-1">
            <div className="flex flex-col flex-1">
                <MarketBar/>
                <div className="flex flex-row h-[920px] border-y border-slate-800">
                    <div className="flex flex-col w-[250px] overflow-hidden border-r border-slate-800">
                        <Watchlist/>
                    </div>
                    <div className="flex flex-col flex-1">
                        <Chart />
                    </div>
                </div>
            </div>
            <div className="w-[10px] flex-col border-slate-800 border-l"></div>
            <div>
                <div className="flex flex-col w-[250px]">
                    <Trade />
                </div>
            </div>
        </div>
        </div>
    )
};


