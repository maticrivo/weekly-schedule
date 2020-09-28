import React, { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { Helmet } from 'react-helmet-async'
import {
  H3,
  H4,
  H5,
  H6,
  Navbar,
  Button,
  AnchorButton,
  HTMLSelect,
  Card,
  Callout,
  Collapse,
  NonIdealState,
  Intent,
  Alignment,
  FocusStyleManager,
  Classes,
  Elevation,
  Code,
  Position,
  Tooltip,
  Spinner,
} from '@blueprintjs/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import data from './data.json'
import TaskAssignment from './TaskAssignment'
import { AppToasterSuccess, AppToasterFail } from './AppToaster'
import { ReactComponent as IsraelFlag } from './israel-flag.svg'

const weekDays = [
  { value: '21/9', label: 'יום שני 21/9' },
  { value: '22/9', label: 'יום שלישי 22/9' },
  { value: '23/9', label: 'יום רביעי 23/9' },
  { value: '24/9', label: 'יום חמישי 24/9' },
  { value: '29/9', label: 'יום שלישי 29/9' },
  { value: '30/9', label: 'יום רביעי 30/9' },
  { value: '1/10', label: 'יום חמישי 1/10' },
]

function App() {
  const today = dayjs().format('D')
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(today)
  const [dayData, setDayData] = useState(data?.[selectedDay])
  const [openWeekly, setOpenWeekly] = useState(
    !dayData || dayData?.special ? false : true,
  )
  const manualClose = useRef(false)

  useEffect(() => {
    FocusStyleManager.onlyShowFocusOnTabs()
  }, [])

  const onDateChange = async (event) => {
    const selectDay = event.currentTarget.value
    setSelectedDay(selectDay)
    setLoading(true)
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    setDayData(data?.[selectDay])
    if (data?.[selectDay]?.special) {
      setOpenWeekly(false)
    } else {
      if (!manualClose.current) {
        setOpenWeekly(true)
      }
    }
    setLoading(false)
  }

  const toggleOpenWeekly = () => {
    manualClose.current = openWeekly
    setOpenWeekly(!openWeekly)
  }

  const onCopy = (message, result) => {
    if (result) {
      AppToasterSuccess.show({ message: 'הועתק בהצלחה' })
    } else {
      AppToasterFail.show({ message: 'העתקה נכשלה' })
    }
  }

  const renderDescription = (description) => {
    if (typeof description === 'string') {
      return <p>{description}</p>
    }

    if (description?.link) {
      return (
        <a
          href={description.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {description.link?.label || description.link.href}
        </a>
      )
    }

    if (description?.mark) {
      return <mark>{description.mark}</mark>
    }

    return null
  }

  return (
    <>
      <Helmet>
        <title>למידה מרחוק ג׳-3</title>
      </Helmet>
      <Navbar fixedToTop className={Classes.RTL}>
        <div className="container">
          <Navbar.Group align={Alignment.RIGHT}>
            <Navbar.Heading>למידה מרחוק ג׳-3</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.LEFT}>
            <HTMLSelect
              value={selectedDay}
              options={[{ value: '', label: '' }, ...weekDays]}
              onChange={onDateChange}
            />
          </Navbar.Group>
        </div>
      </Navbar>
      <main className={Classes.RTL}>
        <div className="container">
          {loading ? (
            <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE} />
          ) : (
            <>
              {data?.tasks && (
                <>
                  <H3>
                    משימות שבועיות:
                    <Button
                      minimal
                      icon={openWeekly ? 'chevron-down' : 'chevron-left'}
                      onClick={toggleOpenWeekly}
                    />
                  </H3>
                  <Collapse isOpen={openWeekly} keepChildrenMounted>
                    {data.tasks.map((weeklyTask, idx) => (
                      <Callout intent={Intent.PRIMARY} icon={null} key={idx}>
                        <H4>{weeklyTask.title}</H4>
                        {weeklyTask?.assignments && (
                          <ul>
                            {weeklyTask.assignments.map((assignment, jdx) => (
                              <TaskAssignment
                                key={`weekly-${idx}-task-${jdx}`}
                                assignment={assignment}
                              />
                            ))}
                          </ul>
                        )}
                      </Callout>
                    ))}
                  </Collapse>
                </>
              )}
              <H3>
                משימות ל
                {selectedDay === today
                  ? 'היום'
                  : weekDays.find((wd) => wd.value === selectedDay).label}
              </H3>
              {dayData ? (
                <>
                  {!dayData.special ? (
                    <Card>
                      <H5>בדיקת נוכחות</H5>
                      <p>
                        <AnchorButton
                          href={dayData.presence}
                          target="_blank"
                          rel="noopener noreferrer"
                          intent={Intent.PRIMARY}
                        >
                          לחצו כאן
                        </AnchorButton>
                      </p>
                    </Card>
                  ) : (
                    <Card elevation={Elevation.THREE} className="card-flag">
                      <IsraelFlag className="flag" />
                    </Card>
                  )}

                  {dayData?.tasks?.map((task, idx) => (
                    <Card key={`task-${idx}`}>
                      {console.log({ task })}
                      <H5>{task.title}</H5>
                      {task.description && renderDescription(task.description)}
                      {task.zoom && (
                        <>
                          <H6>פגישת זום:</H6>
                          {task.zoom.map((zoom, zdx) => (
                            <>
                              <div key={`task-${idx}-zoom-${zdx}`}>
                                {zoom.description}
                                <br />
                                בשעה: {zoom.time}
                                <br />
                                <AnchorButton
                                  outlined
                                  intent={Intent.PRIMARY}
                                  href={zoom.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  לחצו כאן
                                </AnchorButton>
                                {zoom?.meeting?.id && (
                                  <p>
                                    <strong>ID ישיבה:</strong>{' '}
                                    <Code>{zoom.meeting.id}</Code>{' '}
                                    <Tooltip
                                      content="העתק"
                                      position={Position.TOP}
                                    >
                                      <CopyToClipboard
                                        text={zoom.meeting.id}
                                        onCopy={onCopy}
                                      >
                                        <Button
                                          icon="duplicate"
                                          small
                                          minimal
                                        />
                                      </CopyToClipboard>
                                    </Tooltip>
                                    <br />
                                    {zoom.meeting.password && (
                                      <>
                                        <strong>סיסמה:</strong>{' '}
                                        <Code>{zoom.meeting.password}</Code>{' '}
                                        <Tooltip
                                          content="העתק"
                                          position={Position.TOP}
                                        >
                                          <CopyToClipboard
                                            text={zoom.meeting.password}
                                            onCopy={onCopy}
                                          >
                                            <Button
                                              icon="duplicate"
                                              small
                                              minimal
                                            />
                                          </CopyToClipboard>
                                        </Tooltip>
                                      </>
                                    )}
                                  </p>
                                )}
                              </div>
                            </>
                          ))}
                        </>
                      )}
                      {task?.assignments && (
                        <>
                          <H6>משימות:</H6>
                          <ul>
                            {task.assignments.map((assignment, jdx) => (
                              <TaskAssignment
                                key={`task-${idx}-assignment-${jdx}`}
                                assignment={assignment}
                              />
                            ))}
                          </ul>
                        </>
                      )}
                    </Card>
                  ))}
                </>
              ) : (
                <NonIdealState icon="clean" title="אין מטלות להיום" />
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default App
