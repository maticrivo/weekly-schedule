import { useState, useEffect } from 'react'
import Head from 'next/head'
import dayjs from 'dayjs'
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
} from '@blueprintjs/core'

import data from '../data/19-23.04.json'
import TaskAssignment from '../components/task-assignment'

function HomePage({ today }) {
  const [selectedDay, setSelectedDay] = useState(today || dayjs().format('D'))
  const [dayData, setDayData] = useState(data?.[selectedDay])
  const [openWeekly, setOpenWeekly] = useState(true)

  const onDateChange = (event) => {
    const selectDay = event.currentTarget.value
    setSelectedDay(selectDay)
    setDayData(data?.[selectDay])
  }

  useEffect(() => {
    FocusStyleManager.onlyShowFocusOnTabs()
  }, [])

  const toggleOpenWeekly = () => {
    setOpenWeekly(!openWeekly)
  }

  return (
    <>
      <Head>
        <title>למידה מרחוק ב׳-3</title>
      </Head>
      <Navbar fixedToTop className={Classes.RTL}>
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

HomePage.getInitialProps = async () => {
  return { today: dayjs().format('D') }
}

export default HomePage
