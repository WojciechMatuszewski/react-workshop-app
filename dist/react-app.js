"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReactApp = renderReactApp;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("focus-visible");

var _core = require("@emotion/core");

var _react = _interopRequireDefault(require("react"));

var _facepaint = _interopRequireDefault(require("facepaint"));

var _emotionTheming = require("emotion-theming");

var _reactRouterDom = require("react-router-dom");

var _tabs = require("@reach/tabs");

var _stopRunawayReactEffects = require("stop-runaway-react-effects");

var _ri = require("react-icons/ri");

var _logo = _interopRequireDefault(require("./assets/logo"));

var _theme = _interopRequireWildcard(require("./theme"));

/** @jsx jsx */
// polyfill for :focus-visible (https://github.com/WICG/focus-visible)
const originalUseEffect = _react.default.useEffect;
const styleTag = document.createElement('style');
styleTag.innerHTML = [":root{--reach-tabs:1}[data-reach-tabs][data-orientation=vertical]{display:flex}[data-reach-tab-list]{display:flex;background:rgba(0,0,0,.05)}[data-reach-tab-list][aria-orientation=vertical]{flex-direction:column}[data-reach-tab]{display:inline-block;border:none;padding:.25em .5em;margin:0;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-appearance:none;-moz-appearance:none}[data-reach-tab]:active{background:rgba(0,0,0,.05)}[data-reach-tab]:disabled{opacity:.25;cursor:default}[data-reach-tab][data-selected]{border-bottom:1px solid}"].join('\n');
document.head.prepend(styleTag);
const totallyCenteredStyles = {
  minWidth: '100%',
  minHeight: '100%',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center'
};
const visuallyHiddenStyles = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px'
};

function renderReactApp({
  history,
  projectTitle,
  filesInfo,
  lazyComponents,
  imports,
  render,
  options: {
    stopRunawayEffects = true
  } = {}
}) {
  if (process.env.NODE_ENV !== 'production' && stopRunawayEffects && _react.default.useEffect === originalUseEffect) {
    (0, _stopRunawayReactEffects.hijackEffects)();
  }

  const exerciseInfo = [];
  const exerciseTypes = ['final', 'exercise', 'extraCredit', 'instruction'];

  for (const fileInfo of filesInfo) {
    if (exerciseTypes.includes(fileInfo.type)) {
      var _exerciseInfo$fileInf;

      exerciseInfo[fileInfo.number] = (_exerciseInfo$fileInf = exerciseInfo[fileInfo.number]) != null ? _exerciseInfo$fileInf : {
        extraCredit: []
      };
      const info = exerciseInfo[fileInfo.number];

      if (fileInfo.type === 'extraCredit') {
        info.extraCredit.push(fileInfo);
      } else if (fileInfo.type === 'instruction') {
        info.instruction = fileInfo;
        const {
          title,
          number,
          id
        } = fileInfo;
        Object.assign(info, {
          title,
          number,
          id
        });
      } else {
        Object.assign(info, {
          [fileInfo.type]: fileInfo
        });
      }
    }
  }

  for (const info of exerciseInfo) {
    if (info) {
      info.next = exerciseInfo[info.number + 1];
      info.previous = exerciseInfo[info.number - 1];
    }
  }

  const mq = (0, _facepaint.default)(['@media(min-width: 576px)', '@media(min-width: 768px)', '@media(min-width: 992px)', '@media(min-width: 1200px)']);
  (function ({
    label,
    ...props
  }) {
    return (0, _core.jsx)("div", (0, _extends2.default)({
      style: {
        flex: 1,
        padding: 20,
        border: '1px solid',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, props));
  }).displayName = 'ComponentContainer';

  function ExtraCreditLinks({
    exerciseNumber,
    ...props
  }) {
    const {
      extraCredit
    } = exerciseInfo[exerciseNumber];

    if (!extraCredit.length) {
      return null;
    }

    return (0, _core.jsx)("div", (0, _extends2.default)({
      css: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%'
      }
    }, props), (0, _core.jsx)("span", {
      role: "img",
      "aria-label": "Hannah Hundred"
    }, "\uD83D\uDCAF"), (0, _core.jsx)("span", {
      css: {
        fontSize: 14,
        marginRight: '0.25rem',
        opacity: 0.9,
        textTransform: 'uppercase'
      }
    }, "Extra Credits:"), extraCredit.map(({
      extraCreditTitle,
      isolatedPath,
      id
    }, index, array) => (0, _core.jsx)("span", {
      key: id
    }, (0, _core.jsx)("a", {
      href: isolatedPath
    }, extraCreditTitle), array.length - 1 === index ? null : (0, _core.jsx)("span", {
      css: {
        marginRight: 5
      }
    }, ","))));
  }

  ExtraCreditLinks.displayName = 'ExtraCreditLinks';

  function IsolatedHtml({
    importHtml
  }) {
    const [{
      status,
      html,
      error
    }, setState] = _react.default.useState({
      status: 'idle',
      html: null
    });

    _react.default.useEffect(() => {
      importHtml().then(({
        default: htmlString
      }) => {
        setState({
          html: htmlString,
          error: null,
          status: 'success'
        });
      }, e => {
        setState({
          html: null,
          error: e,
          status: 'success'
        });
      });
    }, [importHtml]);

    return (0, _core.jsx)("div", {
      style: {
        minHeight: 300,
        width: '100%'
      }
    }, status === 'idle' || status === 'loading' ? (0, _core.jsx)("div", {
      css: totallyCenteredStyles
    }, "Loading...") : status === 'error' ? (0, _core.jsx)("div", {
      css: totallyCenteredStyles
    }, (0, _core.jsx)("div", null, "Error loading"), (0, _core.jsx)("pre", null, error.message)) : (0, _core.jsx)(HtmlInIframe, {
      html: html
    }));
  }

  IsolatedHtml.displayName = 'IsolatedHtml';

  function HtmlInIframe({
    html
  }) {
    const iframeRef = _react.default.useRef(null);

    _react.default.useEffect(() => {
      if (!iframeRef.current.contentDocument) {
        // if they're navigating around quickly this can happen
        return;
      }

      iframeRef.current.contentDocument.open();
      iframeRef.current.contentDocument.write(html);
      iframeRef.current.contentDocument.close();
    }, [html]);

    return (// eslint-disable-next-line jsx-a11y/iframe-has-title
      (0, _core.jsx)("iframe", {
        style: {
          border: 'none'
        },
        ref: iframeRef
      })
    );
  }

  HtmlInIframe.displayName = 'HtmlInIframe';

  function ExerciseContainer(props) {
    const theme = (0, _emotionTheming.useTheme)();
    const {
      exerciseNumber
    } = (0, _reactRouterDom.useParams)(); // allow the user to continue to the next exercise with the left/right keys

    _react.default.useEffect(() => {
      const handleKeyup = e => {
        if (e.target !== document.body) return;

        if (e.key === 'ArrowRight') {
          const {
            number
          } = exerciseInfo[Number(exerciseNumber) + 1] || exerciseInfo[1];
          history.push(`/${number}`);
        } else if (e.key === 'ArrowLeft') {
          const {
            number
          } = exerciseInfo[Number(exerciseNumber) - 1] || exerciseInfo[exerciseInfo.length - 1];
          history.push(`/${number}`);
        }
      };

      document.body.addEventListener('keyup', handleKeyup);
      return () => document.body.removeEventListener('keyup', handleKeyup);
    }, [exerciseNumber]);

    const {
      instruction,
      exercise,
      final
    } = exerciseInfo[exerciseNumber];
    let exerciseElement, finalElement, instructionElement;

    if (lazyComponents[exercise.id]) {
      exerciseElement = /*#__PURE__*/_react.default.createElement(lazyComponents[exercise.id]);
    }

    if (lazyComponents[final.id]) {
      finalElement = /*#__PURE__*/_react.default.createElement(lazyComponents[final.id]);
    }

    if (lazyComponents[instruction.id]) {
      instructionElement = /*#__PURE__*/_react.default.createElement(lazyComponents[instruction.id]);
    }

    if (exercise.ext === '.html') {
      exerciseElement = (0, _core.jsx)(IsolatedHtml, {
        importHtml: imports[exercise.id]
      });
    }

    if (final.ext === '.html') {
      finalElement = (0, _core.jsx)(IsolatedHtml, {
        importHtml: imports[final.id]
      });
    }

    return (0, _core.jsx)(_react.default.Fragment, null, (0, _core.jsx)(Navigation, {
      exerciseNumber: exerciseNumber,
      mode: props.mode,
      setMode: props.setMode
    }), (0, _core.jsx)("div", {
      css: {
        minHeight: 'calc(100vh - 60px)'
      }
    }, (0, _core.jsx)("div", {
      css: mq({
        display: 'grid',
        gridTemplateColumns: ['100%', '100%', '50% 50%'],
        gridTemplateRows: 'auto'
      })
    }, (0, _core.jsx)("div", {
      css: mq({
        gridRow: [2, 2, 'auto'],
        height: ['auto', 'auto', 'calc(100vh - 60px)'],
        overflowY: ['auto', 'auto', 'scroll'],
        padding: '1rem 2rem 3rem 2rem',
        borderTop: `1px solid ${theme.sky}`,
        '::-webkit-scrollbar': {
          background: theme.skyLight,
          borderLeft: `1px solid ${theme.sky}`,
          borderRight: `1px solid ${theme.sky}`,
          width: 10
        },
        '::-webkit-scrollbar-thumb': {
          background: theme.skyDark
        },
        'p, li': {
          fontSize: 18,
          lineHeight: 1.5
        },
        blockquote: {
          borderLeft: `2px solid ${theme.primary}`,
          margin: 0,
          paddingLeft: '1.5rem'
        },
        pre: {
          background: theme.sky,
          fontSize: '80%',
          margin: '0 -2rem',
          padding: '2rem'
        },
        ul: {
          padding: 0,
          listStylePosition: 'inside'
        },
        'ul ul': {
          paddingLeft: '2rem'
        },
        'p > code': {
          background: theme.sky,
          color: theme.text,
          fontSize: '85%',
          padding: '3px 5px'
        }
      })
    }, (0, _core.jsx)(_react.default.Suspense, {
      fallback: (0, _core.jsx)("div", {
        css: totallyCenteredStyles
      }, "Loading...")
    }, instructionElement)), (0, _core.jsx)("div", {
      css: {
        background: theme.background
      }
    }, (0, _core.jsx)(_tabs.Tabs, {
      css: {
        background: theme.backgroundLight,
        borderTop: `1px solid ${theme.sky}`,
        height: '100%',
        position: 'relative',
        zIndex: 10,
        '[data-reach-tab]': {
          padding: '0.5rem 1.25rem',
          ':hover': {
            color: theme.primary
          }
        },
        '[data-reach-tab][data-selected]': {
          background: theme.backgroundLight,
          border: 'none',
          svg: {
            fill: theme.primary
          },
          ':hover': {
            color: 'inherit'
          }
        }
      }
    }, (0, _core.jsx)(_tabs.TabList, {
      css: {
        height: 50,
        background: theme.skyLight
      }
    }, (0, _core.jsx)(_tabs.Tab, {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, (0, _core.jsx)(_ri.RiToolsLine, {
      size: "20",
      color: theme.textLightest,
      css: {
        marginRight: 5
      }
    }), (0, _core.jsx)("span", null, "Exercise")), (0, _core.jsx)(_tabs.Tab, {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, (0, _core.jsx)(_ri.RiFlagLine, {
      size: "18",
      color: theme.textLightest,
      css: {
        marginRight: 5
      }
    }), "Final")), (0, _core.jsx)(_tabs.TabPanels, null, (0, _core.jsx)(_tabs.TabPanel, null, (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
      }
    }, (0, _core.jsx)("a", {
      css: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1rem',
        textDecoration: 'none'
      },
      href: exercise.isolatedPath
    }, (0, _core.jsx)(_ri.RiExternalLinkLine, {
      css: {
        marginRight: '0.25rem'
      }
    }), 'Open exercise on isolated page')), (0, _core.jsx)("div", {
      css: [totallyCenteredStyles, mq({
        color: '#19212a',
        background: 'white',
        padding: '2rem 0',
        minHeight: 500,
        height: ['auto', 'auto', 'calc(100vh - 210px)'],
        overflowY: ['auto', 'auto', 'scroll']
      })]
    }, (0, _core.jsx)(_react.default.Suspense, {
      fallback: (0, _core.jsx)("div", {
        // this centers the loading with the loading
        // for the instructions
        css: [totallyCenteredStyles, mq({
          marginBottom: ['auto', 'auto', 80]
        })]
      }, "Loading...")
    }, (0, _core.jsx)("div", {
      className: "exercise-container render-container",
      css: mq({
        paddingBottom: [0, 0, '2rem']
      })
    }, exerciseElement)))), (0, _core.jsx)(_tabs.TabPanel, null, (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
      }
    }, (0, _core.jsx)("a", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1rem',
        textDecoration: 'none'
      },
      href: final.isolatedPath
    }, (0, _core.jsx)(_ri.RiExternalLinkLine, {
      css: {
        marginRight: '0.25rem'
      }
    }), ' Open final on isolated page')), (0, _core.jsx)("div", {
      css: [totallyCenteredStyles, mq({
        color: '#19212a',
        background: 'white',
        padding: '2rem 0',
        minHeight: 500,
        height: ['auto', 'auto', 'calc(100vh - 210px)'],
        overflowY: ['auto', 'auto', 'scroll']
      })]
    }, (0, _core.jsx)(_react.default.Suspense, {
      fallback: (0, _core.jsx)("div", {
        // this centers the loading with the loading
        // for the instructions
        css: [totallyCenteredStyles, mq({
          marginBottom: ['auto', 'auto', 80]
        })]
      }, "Loading...")
    }, (0, _core.jsx)("div", {
      className: "final-container render-container",
      css: mq({
        paddingBottom: [0, 0, '2rem']
      })
    }, finalElement))))), (0, _core.jsx)(ExtraCreditLinks, {
      exerciseNumber: exerciseNumber,
      css: mq({
        background: theme.background,
        bottom: 0,
        padding: '1rem',
        position: ['static', 'static', 'fixed'],
        width: ['100%', '100%', '50%']
      })
    }))))));
  }

  ExerciseContainer.displayName = 'ExerciseContainer';

  function Navigation({
    exerciseNumber,
    mode,
    setMode
  }) {
    const theme = (0, _emotionTheming.useTheme)();
    const info = exerciseInfo[exerciseNumber];
    return (0, _core.jsx)("div", {
      css: mq({
        a: {
          textDecoration: 'none'
        },
        alignItems: 'center',
        background: theme.backgroundLight,
        boxShadow: '0 0.9px 1.5px -18px rgba(0, 0, 0, 0.024), 0 2.4px 4.1px -18px rgba(0, 0, 0, 0.035), 0 5.7px 9.9px -18px rgba(0, 0, 0, 0.046), 0 19px 33px -18px rgba(0, 0, 0, 0.07)',
        display: 'grid',
        gridTemplateColumns: exerciseNumber ? ['3fr .5fr', '1fr 2fr', '1fr 1fr'] : '1fr 1fr',
        height: 60,
        padding: ['0 1rem', '0 1.75rem'],
        width: '100%',
        'span[role="img"]': {
          fontSize: [24, 24, 'inherit']
        },
        '.exercise-title': {
          color: theme.text,
          display: ['none', 'inline-block', 'inline-block'],
          fontSize: 15,
          opacity: 0.9,
          ':hover': {
            opacity: 1
          }
        }
      })
    }, (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, (0, _core.jsx)(_reactRouterDom.Link, {
      to: "/",
      css: {
        display: 'flex',
        alignItems: 'center',
        color: 'inherit'
      }
    }, (0, _core.jsx)(_logo.default, {
      css: {
        marginRight: '.5rem'
      },
      strokeWidth: 0.8
    }), (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, (0, _core.jsx)("h1", {
      css: {
        fontSize: 16,
        margin: 0
      }
    }, projectTitle)))), (0, _core.jsx)("div", {
      css: {
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: exerciseNumber ? '3fr 2fr 3fr 3rem' : '1fr',
        paddingLeft: '1rem',
        width: '100%'
      }
    }, exerciseNumber && (0, _core.jsx)(_react.default.Fragment, null, (0, _core.jsx)("div", null, info.previous ? (0, _core.jsx)(_reactRouterDom.Link, {
      to: `/${info.previous.number}`,
      css: {
        display: 'flex',
        alignItems: 'center'
      }
    }, (0, _core.jsx)(_ri.RiArrowLeftSLine, {
      size: 20
    }), (0, _core.jsx)("span", {
      className: "exercise-title"
    }, info.previous.title)) : null), (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, exerciseInfo.map(e => (0, _core.jsx)(_react.default.Fragment, {
      key: e.id
    }, (0, _core.jsx)("input", {
      id: `exercise-dot-${e.id}`,
      type: "radio",
      name: "exercise-dots",
      checked: e.id === info.id,
      onChange: () => history.push(`/${e.number}`),
      css: visuallyHiddenStyles
    }), (0, _core.jsx)("label", {
      htmlFor: `exercise-dot-${e.id}`,
      title: e.title
    }, (0, _core.jsx)("span", {
      css: visuallyHiddenStyles
    }, e.title), (0, _core.jsx)("span", {
      css: {
        cursor: 'pointer',
        display: 'block',
        background: e.id === info.id ? theme.primary : theme.skyDark,
        borderRadius: '50%',
        height: 12,
        width: 12,
        margin: '0 6px'
      }
    }))))), (0, _core.jsx)("div", {
      css: {
        textAlign: 'right'
      }
    }, info.next ? (0, _core.jsx)(_reactRouterDom.Link, {
      to: `/${info.next.number}`,
      css: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, (0, _core.jsx)("span", {
      className: "exercise-title"
    }, info.next.title), ' ', (0, _core.jsx)(_ri.RiArrowRightSLine, {
      size: 20
    })) : null)), (0, _core.jsx)("div", {
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }
    }, (0, _core.jsx)("button", {
      css: {
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: theme.text,
        textAlign: 'right'
      },
      onClick: () => setMode(mode === 'light' ? 'dark' : 'light')
    }, mode === 'light' ? (0, _core.jsx)(_ri.RiMoonClearLine, {
      size: "1.25rem",
      color: "currentColor"
    }) : (0, _core.jsx)(_ri.RiSunLine, {
      size: "1.25rem",
      color: "currentColor"
    })))));
  }

  Navigation.displayName = 'Navigation';

  function Home(props) {
    const theme = (0, _emotionTheming.useTheme)();
    return (0, _core.jsx)(_react.default.Fragment, null, (0, _core.jsx)(Navigation, {
      mode: props.mode,
      setMode: props.setMode
    }), (0, _core.jsx)("div", {
      css: mq({
        width: '100%',
        maxWidth: 800,
        minHeight: '85vh',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      })
    }, (0, _core.jsx)(_logo.default, {
      size: 120,
      css: {
        marginTop: '3rem'
      }
    }), (0, _core.jsx)("h1", {
      css: mq({
        textAlign: 'center',
        marginBottom: ['4rem', '4rem'],
        marginTop: '3rem'
      })
    }, projectTitle), (0, _core.jsx)("div", {
      css: mq({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: ['auto', 'auto'],
        gridGap: '1rem'
      })
    }, exerciseInfo.filter(Boolean).map(({
      id,
      number,
      title,
      final,
      exercise
    }) => {
      return (0, _core.jsx)("div", {
        key: id,
        css: mq({
          alignItems: 'center',
          background: theme.backgroundLight,
          borderRadius: 5,
          boxShadow: '0 0px 1.7px -7px rgba(0, 0, 0, 0.02), 0 0px 4px -7px rgba(0, 0, 0, 0.028), 0 0px 7.5px -7px rgba(0, 0, 0, 0.035), 0 0px 13.4px -7px rgba(0, 0, 0, 0.042), 0 0px 25.1px -7px rgba(0, 0, 0, 0.05), 0 0px 60px -7px rgba(0, 0, 0, 0.07)',
          display: 'grid',
          fontSize: '18px',
          gridTemplateColumns: ['auto', '60% 40%'],
          position: 'relative',
          ':hover': {
            background: theme.skyLight,
            small: {
              opacity: 1
            },
            '::before': {
              background: theme.primary,
              border: `2px solid ${theme.primary}`,
              color: theme.background
            }
          },
          '::before': {
            alignItems: 'center',
            background: theme.backgroundLight,
            border: `2px solid ${theme.skyDark}`,
            borderRadius: 12,
            color: theme.textLightest,
            content: `"${number}"`,
            display: ['none', 'flex'],
            fontSize: 12,
            fontWeight: 600,
            height: 24,
            justifyContent: 'center',
            marginLeft: 23,
            marginTop: 0,
            paddingTop: 1,
            paddingLeft: 1,
            position: 'absolute',
            textAlign: 'center',
            width: 24,
            zIndex: 1
          },
          '::after': {
            content: '""',
            position: 'absolute',
            display: ['none', 'block'],
            width: 2,
            height: 'calc(100% + 1rem)',
            background: theme.skyDark,
            marginLeft: 34
          },
          ':first-of-type': {
            '::after': {
              content: '""',
              position: 'absolute',
              display: ['none', 'block'],
              width: 2,
              height: 'calc(50% + 1rem)',
              background: theme.skyDark,
              marginLeft: 34,
              marginTop: '4rem'
            }
          },
          ':last-of-type': {
            '::after': {
              content: '""',
              position: 'absolute',
              display: ['none', 'block'],
              width: 2,
              height: 'calc(50% + 1rem)',
              background: theme.skyDark,
              marginLeft: 34,
              marginBottom: '4rem'
            }
          }
        })
      }, (0, _core.jsx)(_reactRouterDom.Link, {
        to: `/${number}`,
        css: mq({
          padding: ['2rem 2rem 0 2rem', '2rem 2.5rem 2rem 2rem'],
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          ':hover': {
            h3: {
              textDecoration: 'underline',
              textDecorationColor: 'rgba(0,0,0,0.3)'
            }
          }
        })
      }, (0, _core.jsx)("small", {
        css: mq({
          display: ['block', 'none'],
          opacity: 0.7,
          fontSize: 14
        })
      }, number), (0, _core.jsx)("h3", {
        css: mq({
          fontSize: [24, 20],
          fontWeight: [600, 500],
          margin: 0,
          marginLeft: ['1rem', '2rem']
        })
      }, title)), (0, _core.jsx)("div", {
        css: mq({
          width: '100%',
          display: 'flex',
          flexDirection: ['column', 'row'],
          height: ['auto', 48],
          padding: ['1.5rem 1rem', '8px 15px'],
          alignItems: 'center'
        })
      }, (0, _core.jsx)("a", {
        href: exercise.isolatedPath,
        title: "exercise",
        css: mq({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: ['flex-start', 'center'],
          color: 'inherit',
          padding: ['.7rem 1rem', 0],
          fontSize: 16,
          height: [48, 56],
          textDecoration: 'none',
          borderRadius: 5,
          ':hover': {
            background: theme.backgroundLight,
            svg: {
              fill: theme.primary
            }
          }
        })
      }, (0, _core.jsx)(_ri.RiToolsLine, {
        size: "20",
        color: theme.textLightest,
        css: {
          marginRight: 5
        }
      }), (0, _core.jsx)("span", null, "Exercise")), (0, _core.jsx)("a", {
        href: final.isolatedPath,
        title: "final version",
        css: mq({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: ['flex-start', 'center'],
          color: 'inherit',
          padding: ['.7rem 1rem', 0],
          height: [48, 56],
          fontSize: 16,
          textDecoration: 'none',
          borderRadius: 5,
          ':hover': {
            background: theme.backgroundLight,
            svg: {
              fill: theme.primary
            }
          }
        })
      }, (0, _core.jsx)(_ri.RiFlagLine, {
        size: "18",
        color: theme.textLightest,
        css: {
          marginRight: 5
        }
      }), (0, _core.jsx)("span", null, "Final Version"))));
    }))));
  }

  Home.displayName = 'Home';

  function NotFound() {
    const theme = (0, _emotionTheming.useTheme)();
    return (0, _core.jsx)("div", {
      css: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }, (0, _core.jsx)("div", null, (0, _core.jsx)(_logo.default, {
      size: 120,
      color: theme.skyDark,
      strokeWidth: 0.7,
      css: {
        opacity: 0.7
      }
    }), (0, _core.jsx)("h1", null, `Sorry... nothing here.`), `To open one of the exercises, go to `, (0, _core.jsx)("code", null, `/exerciseNumber`), `, for example: `, (0, _core.jsx)(_reactRouterDom.Link, {
      to: "/1"
    }, (0, _core.jsx)("code", null, `/1`)), (0, _core.jsx)("div", {
      css: {
        marginTop: '2rem',
        a: {
          textDecoration: 'none'
        }
      }
    }, (0, _core.jsx)(_reactRouterDom.Link, {
      to: "/",
      css: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, (0, _core.jsx)(_ri.RiArrowLeftSLine, null), "Back home"))));
  }

  NotFound.displayName = 'NotFound';

  function useDarkMode() {
    const preferDarkQuery = '(prefers-color-scheme: dark)';

    const [mode, setMode] = _react.default.useState(() => window.localStorage.getItem('colorMode') || (window.matchMedia(preferDarkQuery).matches ? 'dark' : 'light'));

    _react.default.useEffect(() => {
      const mediaQuery = window.matchMedia(preferDarkQuery);

      const handleChange = () => {
        setMode(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }, []);

    _react.default.useEffect(() => {
      window.localStorage.setItem('colorMode', mode);
    }, [mode]); // we're doing it this way instead of as an effect so we only
    // set the localStorage value if they explicitly change the default


    return [mode, setMode];
  }

  function DelayedTransition() {
    // we have it this way so dark mode is rendered immediately rather than
    // transitioning to it on initial page load.
    const [renderStyles, setRender] = _react.default.useState(false);

    _react.default.useEffect(() => {
      const timeout = setTimeout(() => {
        setRender(true);
      }, 450);
      return () => clearTimeout(timeout);
    }, []);

    return renderStyles ? (0, _core.jsx)(_core.Global, {
      styles: {
        '*, *::before, *::after': {
          // for the theme change
          transition: `background 0.4s, background-color 0.4s, border-color 0.4s`
        }
      }
    }) : null;
  }

  return render((0, _core.jsx)(function () {
    const [mode, setMode] = useDarkMode();
    const theme = (0, _theme.default)(mode);

    _react.default.useLayoutEffect(() => {
      document.getElementById('root').classList.add('react-workshop-app');
    });

    return (0, _core.jsx)(_emotionTheming.ThemeProvider, {
      theme: theme
    }, (0, _core.jsx)(_reactRouterDom.Router, {
      history: history
    }, (0, _core.jsx)(_reactRouterDom.Switch, null, (0, _core.jsx)(_reactRouterDom.Route, {
      exact: true,
      path: "/"
    }, (0, _core.jsx)(Home, {
      mode: mode,
      setMode: setMode
    })), (0, _core.jsx)(_reactRouterDom.Route, {
      exact: true,
      path: "/:exerciseNumber"
    }, (0, _core.jsx)(ExerciseContainer, {
      mode: mode,
      setMode: setMode
    })), (0, _core.jsx)(_reactRouterDom.Route, null, (0, _core.jsx)(NotFound, null)))), (0, _core.jsx)(_core.Global, {
      styles: {
        'html, body, #root': {
          background: theme.background,
          color: theme.text
        },
        '::selection': {
          background: theme.primary,
          color: 'white'
        },
        '[data-reach-tab]': {
          cursor: 'pointer'
        },
        a: {
          color: theme.primary
        },

        /*
          This will hide the focus indicator if the element receives focus via the mouse,
          but it will still show up on keyboard focus.
        */
        '.js-focus-visible :focus:not(.focus-visible)': {
          outline: 'none'
        },
        hr: {
          background: theme.textLightest
        }
      }
    }), (0, _core.jsx)(_core.Global, {
      styles: `
              ${mode === 'light' ? _theme.prismThemeLight : _theme.prismThemeDark}
            `
    }), (0, _core.jsx)(DelayedTransition, null));
  }, null), document.getElementById('root'));
}
/*
eslint
  max-statements: "off"
*/