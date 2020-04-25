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
} from '@blueprintjs/core'

import data from './data.json'
import TaskAssignment from './TaskAssignment'
import { ReactComponent as IsraelFlag } from './israel-flag.svg'

function App() {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('D'))
  const [dayData, setDayData] = useState(data?.[selectedDay])
  const [openWeekly, setOpenWeekly] = useState(
    !dayData || dayData?.special ? false : true,
  )
  const manualClose = useRef(false)

  const onDateChange = (event) => {
    const selectDay = event.currentTarget.value
    setSelectedDay(selectDay)
    setDayData(data?.[selectDay])
    if (data?.[selectDay]?.special) {
      setOpenWeekly(false)
    } else {
      if (!manualClose.current) {
        setOpenWeekly(true)
      }
    }
  }

  useEffect(() => {
    FocusStyleManager.onlyShowFocusOnTabs()
  }, [])

  const toggleOpenWeekly = () => {
    manualClose.current = openWeekly
    setOpenWeekly(!openWeekly)
  }

  return (
    <>
      <Helmet>
        <title>למידה מרחוק ב׳-3</title>
      </Helmet>
      <Navbar fixedToTop className={Classes.RTL}>
        <div className="container">
          <Navbar.Group align={Alignment.RIGHT}>
            <Navbar.Heading>למידה מרחוק ב׳-3</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.LEFT}>
            <HTMLSelect
              value={selectedDay}
              options={[
                { value: '', label: '' },
                { value: '26', label: 'יום ראשון 26/4' },
                { value: '27', label: 'יום שני 27/4' },
                { value: '28', label: 'יום שלישי 28/4' },
                { value: '29', label: 'יום רביעי 29/4' },
                { value: '30', label: 'יום חמישי 30/4' },
              ]}
              onChange={onDateChange}
            />
          </Navbar.Group>
        </div>
      </Navbar>
      <main className={Classes.RTL}>
        <div className="container">
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
                          <TaskAssignment key={jdx} assignment={assignment} />
                        ))}
                      </ul>
                    )}
                  </Callout>
                ))}
              </Collapse>
            </>
          )}
          <H3>משימות להיום:</H3>
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
                <Card key={idx}>
                  <H5>{task.title}</H5>
                  {task.description && <p>{task.description}</p>}
                  {task.zoom && (
                    <>
                      <H6>פגישת זום:</H6>
                      {task.zoom.map((zoom, zdx) => (
                        <p key={zdx}>
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
                        </p>
                      ))}
                    </>
                  )}
                  {task?.assignments && (
                    <>
                      <H6>משימות:</H6>
                      <ul>
                        {task.assignments.map((assignment, jdx) => (
                          <TaskAssignment key={jdx} assignment={assignment} />
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
        </div>
      </main>
    </>
  )
}

export default App
