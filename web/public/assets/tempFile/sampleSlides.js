const superpointProperties = {
  'name': 'Fundamental Concepts',
  'createdOn': 1561454678,
  'createdBy': 'dsvmdw32r2oemcowcmoq',
  'description': 'Fundamental Concepts',
  'instituteId': '1LdF8IiaraX3MSSBnvd0Cs9IU8Q',
  'presentationId': '1N8FBC1OfgTioDqJp907n5CpCd1',
  'slidesMetadata': [
    {
      'name': 'slide3',
      'slideType': 'methodDraw',
      'slideOrdinality': 0,
      'isActive': true,
      'slideId': '1N8FBC1OfgTioDqJp907s3'
    },
    {
      'name': 'slide1',
      'slideType': 'slideTemplates',
      'slideOrdinality': 1,
      'isActive': true,
      'slideId': '1N8FBC1OfgTioDqJp907s1'
    },
    {
      'name': 'slide2',
      'slideType': 'slideTemplates',
      'slideOrdinality': 2,
      'isActive': true,
      'slideId': '1N8FBC1OfgTioDqJp907s2'
    }
    // ,
    // {
    //   'name': 'slide3',
    //   'slideType': 'questionTemplate',
    //   'slideOrdinality': 2,
    //   'isActive': true,
    //   'slideId': '1N8FBC1OfgTioDqJp907s3'
    // }
  ],
  'paperDetails': {
    'paperId': '32fc2cwesc4c2qdcrv45',
    'code': 'P1001',
    'name': 'Physics'
  },
  'config': { // need to ask what else properties require
    'enableTimer': false,
    'enableNextSlide': true,
    'enablePrevSlide': true
  }
}
const slides = [
  {
    'slideId': '1N8FBC1OfgTioDqJp907s3',
    'data': {
      'svg': {
        'type': 'svg',
        'value': '<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">\n  <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->\n  <g>\n   <title>background</title>\n   <rect fill="#fff" id="canvas_background" height="770" width="1026" y="-1" x="-1"/>\n   <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">\n    <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>\n   </g>\n  </g>\n  <g>\n   <title>Layer 1</title>\n   <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_1" y="296" x="396.5" stroke-width="0" stroke="#000" fill="#000000">Enter text here</text>\n  </g>\n </svg>'
      }
    },
    'dependancies': {
      'templateName': 'SVGTitle',
      'templateText': 'SVGTitle',
      'type': 'methodDraw',
      'componentType': 'methodDraw'
    },
    'properties': {
      'slideTime': 10,
      'tags': []
    }
  },
  {
    'slideId': '1N8FBC1OfgTioDqJp907s1',
    'data': {
      'media': {
        'type': 'media',
        'value': 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    },
    'dependancies': {
      'templateName': 'mediaplayer',
      'templateText': 'mediaplayer',
      'type': 'slideTemplate',
      'componentType': 'vue'
    },
    'properties': {
      'slideTime': 10,
      'tags': []
    }

  },
  {
    'slideId': '1N8FBC1OfgTioDqJp907s2',
    'data': {
      'media': {
        'type': 'media',
        'value': 'https://media.w3.org/2010/05/bunny/trailer.mp4'
      }
    },
    'dependancies': {
      'templateName': 'mediaplayer',
      'templateText': 'mediaplayer',
      'type': 'slideTemplate',
      'componentType': 'vue'
    },
    'properties': {
      'slideTime': 10,
      'tags': []
    }

  }
  // ,
  // {
  //   'slideId': '1N8FBC1OfgTioDqJp907s3',
  //   'data': {
  //     'questionId': 'Q11N8FBC1OfgTioDqJp907s3'
  //   },
  //   'dependancies': {
  //     'templateName': 'Question',
  //     'templateText': 'Question',
  //     'type': 'questionTemplate',
  //     'componentType': 'vue'
  //   },
  //   'properties': {
  //     'slideTime': 10,
  //     'tags': []
  //   },
  //   'questionProperties': {
  //     'bloomsLevel': '2'
  //   }

  // }
]
const getSlideBySlideId = (slideId) => {
  let slide = {}
  for (let i = 0; i < slides.length; i++) {
    if (slides[i].slideId === slideId) {
      slide = slides[i]
      break
    }
  }
  return slide
}
const getFirstSlide = () => {
  return slides[0]
}

export default {
  superpointProperties,
  getSlideBySlideId,
  getFirstSlide
}
