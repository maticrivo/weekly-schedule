function TaskAssignment({ assignment }) {
  return (
    <li>
      {assignment?.link && (
        <a
          href={assignment.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {assignment.link?.label || assignment.link.href}
        </a>
      )}
      {assignment?.mark && <mark>{assignment.mark}</mark>}
      {typeof assignment === 'string' && assignment}
    </li>
  )
}

export default TaskAssignment
