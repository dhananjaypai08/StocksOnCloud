export const MarketBar = ({ data }) => {
  const lastDataPoint = data[data.length - 1];
  const secondLastDataPoint = data.length > 1 ? data[data.length - 2] : null;
  const difference = secondLastDataPoint
    ? lastDataPoint.value - secondLastDataPoint.value
    : null;
  const percentageChange = secondLastDataPoint
    ? (difference / secondLastDataPoint.value) * 100
    : null;
  const textName = difference >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div>
      <div className="p-2 pl-4 flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums text-greenText text-md text-green-500`}
              >
                Current Price
              </p>
              <p className="font-medium text-slate-200 text-sm text-sm tabular-nums">
                {lastDataPoint.value}
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`font-medium text-xs text-slate-400 text-sm`}>
                Change
              </p>
              <p
                className={` text-sm font-medium tabular-nums leading-5 ${textName}`}
              >
                {difference.toFixed(2)} {percentageChange.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H High
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                401
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H Low
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                384
              </p>
            </div>
            <button
              type="button"
              className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
              data-rac=""
            >
              <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400 text-sm">
                  24H Volume
                </p>
                <p className="mt-1 text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                  298176
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
