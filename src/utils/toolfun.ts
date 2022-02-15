// localStorage存储数据
export let localWrite = (key: string, value: any) => {
  if (value) {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
};

// localStorage读取数据
export let localRead = (key: string) => {
  let value: string | null = localStorage.getItem(key);
  if (value && value != "undefined" && value != "null") {
    return JSON.parse(value);
  }
  return null;
};

// sessionStorage存储数据
export let sessionWrite = (key: string, value: any) => {
  if (value) {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

// sessionStorage读取数据
export let sessionRead = (key: string) => {
  let value: string | null = sessionStorage.getItem(key);
  if (value && value != "undefined" && value != "null") {
    return JSON.parse(value);
  }
  return null;
};
