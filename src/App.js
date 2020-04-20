import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Helmet } from 'react-helmet-async'
import {
  Navbar,
  Alignment,
  HTMLSelect,
  Card,
  H5,
  Intent,
  AnchorButton,
  NonIdealState,
  Elevation,
  H6,
} from '@blueprintjs/core'

import data from './data.json'

function App() {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('D'))
  const [dayData, setDayData] = useState(data?.[selectedDay])

  const onDateChange = (event) => {
    const selectDay = event.currentTarget.value
    setSelectedDay(selectDay)
    setDayData(data?.[selectDay])
  }

  return (
    <>
      <Helmet>
        <title>למידה מרחוק ב׳-3</title>
      </Helmet>
      <header>
        <Navbar>
          <div className="container">
            <Navbar.Group align={Alignment.RIGHT}>
              <Navbar.Heading>למידה מרחוק ב׳-3</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.LEFT}>
              <HTMLSelect
                value={selectedDay}
                options={[
                  { value: '19', label: 'יום ראשון 19/4' },
                  { value: '20', label: 'יום שני 20/4' },
                  { value: '21', label: 'יום שלישי 21/4' },
                  { value: '22', label: 'יום רביעי 22/4' },
                  { value: '23', label: 'יום חמישי 23/4' },
                ]}
                onChange={onDateChange}
              />
            </Navbar.Group>
          </div>
        </Navbar>
      </header>
      <main>
        <div className="container">
          {dayData ? (
            <>
              <Card elevation={Elevation.ONE}>
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
              {dayData?.tasks?.map((task, idx) => (
                <Card key={idx} elevation={Elevation.ONE}>
                  <H5>{task.title}</H5>
                  {task.description && <p>{task.description}</p>}
                  {task.zoom && (
                    <>
                      <H6>פגישות זום:</H6>
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
                        {task.assignments.map((assignment, jdx) => {
                          if (typeof assignment === 'string') {
                            return <li key={jdx}>{assignment}</li>
                          }
                          if (assignment?.link) {
                            return (
                              <li key={jdx}>
                                <a
                                  href={assignment.link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {assignment.link?.label ||
                                    assignment.link.href}
                                </a>
                              </li>
                            )
                          }
                          return null
                        })}
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
