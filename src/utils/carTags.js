export function formatTagName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function collectTagOptions(cars) {
  const names = new Set();
  cars.forEach((car) => {
    car.tags?.forEach((tag) => {
      if (tag?.name) names.add(tag.name);
    });
  });

  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'ru'));

  return [
    { value: '', label: 'Все теги' },
    ...sorted.map((name) => ({ value: name, label: formatTagName(name) })),
  ];
}
