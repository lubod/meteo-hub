import React from "react";
import { observer } from "mobx-react";
import { LoadImg } from "../misc/loadImg";
import Text from "../misc/text";
import { AppContext } from "..";
import Time from "../misc/time";

type Props = {
  appContext: AppContext;
};

const DomHeader = observer(({ appContext }: Props) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-row justify-between">
      <Text>CURRENT DATA</Text>
      <button
        type="button"
        aria-label="Reload"
        onClick={() => {
          appContext.cCtrl.fetchData();
          appContext.cCtrl.fetchTrendData();
        }}
      >
        <LoadImg
          rotate={
            appContext.cCtrl.domData.loading || appContext.cCtrl.domData.oldData
          }
          src="icons8-refresh-25.svg"
          alt=""
        />
      </button>
    </div>
    <div className="flex flex-row">
      <div className="flex flex-col gap-4 basis-1/2">
        <Time
          label="Data date"
          time={appContext.cCtrl.domData.data.timestamp}
          format="DD MMM YYYY"
          old={appContext.cCtrl.domData.oldData}
        />
      </div>
      <div className="flex flex-col gap-4 basis-1/2">
        <Time
          label="Data time"
          time={appContext.cCtrl.domData.data.timestamp}
          format="HH:mm:ss"
          old={appContext.cCtrl.domData.oldData}
        />
      </div>
    </div>
  </div>
));

export default DomHeader;
