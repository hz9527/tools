function getHeader(setting: any): string {
  return `<head>
  <meta charset="utf-8"/>
  <title>${setting.name} Demo</title>
  <link rel="stylesheet" href="./iconfont-base.css">
  <link rel="stylesheet" href="./icons.css">
  <style>
    body {
      font-size: 16px;
      background: #efefef;
    }
    .container {
      column-count: 10;
      column-gap: 5px;
    }
    .item {
      break-inside: avoid-column;
      padding: 10px;
      background-color: #fff;
      border-radius: 3px;
      box-sizing: border-box;
      margin-bottom: 5px;
      opacity: 0.8;
      transition: all .2s;
      cursor: pointer;
    }
    .item .text {
      font-size: 12px;
    }
    .show-code, .show-class {
      text-align: center;
    }
    .show-code:hover, .show-class:hover {
      transform: scale(2);
    }
    .show-class {
      padding: 30px;
      font-size: 40px;
    }
  </style>
</head>`
}

export default getHeader;