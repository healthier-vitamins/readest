import React, { useEffect } from "react";
function useConditionalEffect(effect: Function, conditions: any[]) {
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      for (const condition of conditions) {
        if (!condition) {
          return;
        }
      }
      hasRun.current = true;
      effect();
    }
  });
}

// function useErrorNotification(errMsg: string) {
//   const dispatch = useAppDispatch();
//   dispatch(addToastNotificationArr(errMsg));
// }

export { useConditionalEffect };
