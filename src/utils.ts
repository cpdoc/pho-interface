export const legendToJSON = (
  text: string
): { [key: string]: string | number }[] | null => {
  const lines = text.trim().split("\n");
  const jsonObjects = [];

  let currentId = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^\d+$/.test(line)) {
      currentId = parseInt(line);
    } else if (line.includes("-->")) {
      const timeLines: RegExpMatchArray | null =
        line.match(/(\d{2}:\d{2}:\d{2})/);
      let time = timeLines ? timeLines[0].split(":") : [];
      const startTime: string[] = [];
      time.forEach((time: string, index: number) => {
        if (Number(time) > 0) {
          startTime.push(time);
        } else if (index === 1) {
          startTime.push("0");
        } else if (index === 2) {
          startTime.push("00");
        }
      });

      const content = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== "") {
        content.push(lines[j].trim());
        j++;
      }

      const result: { [key: string]: string | number } = {
        startTime: startTime.join(":"),
        rawStartTime: +time[0] * 60 * 60 + +time[1] * 60 + +time[2],
        content: content.join("\n"),
      };

      if (currentId) {
        result.id = String(currentId);
      }

      jsonObjects.push(result);

      currentId = null;
      i = j - 1; // Update loop index to skipping content lines
    }
  }

  return jsonObjects;
};

export const normalizeValue = (value: string) => {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const createDebounce = () => {
  let timer: ReturnType<typeof setTimeout>;
  return (fn: Function, wait: number = 300) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (typeof fn === "function") {
        fn();
      }
    }, wait);
  };
};
