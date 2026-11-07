with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

cutout_css = '''
    /* 21st.dev Style Inverted Cutout Notch for About Cards */
    .card-cutout-notch {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 66px;
      height: 66px;
      background: #071530;
      border-top-left-radius: 26px;
      pointer-events: none;
      z-index: 5;
    }
    .card-cutout-notch::before {
      content: '';
      position: absolute;
      top: -20px;
      right: 0;
      width: 20px;
      height: 20px;
      background: transparent;
      border-bottom-right-radius: 20px;
      box-shadow: 6px 6px 0 0 #071530;
    }
    .card-cutout-notch::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -20px;
      width: 20px;
      height: 20px;
      background: transparent;
      border-bottom-right-radius: 20px;
      box-shadow: 6px 6px 0 0 #071530;
    }
'''

if '.card-cutout-notch' not in text:
    target = '</style>'
    # Insert right before the last </style> before <body>
    idx = text.rfind('</style>', 0, text.find('<body'))
    if idx != -1:
        text = text[:idx] + cutout_css + text[idx:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Added .card-cutout-notch CSS to index.html successfully!")
    else:
        print("Could not find </style> before <body>")
else:
    print(".card-cutout-notch already exists in index.html")

