export const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}






