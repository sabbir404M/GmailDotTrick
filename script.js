function generateDotVariations(username, limit = 50000) {
  const variations = new Set();
  const cleanUsername = username.replace(/\./g, '');

  const totalCombinations = Math.pow(2, cleanUsername.length - 1);

  for (let i = 0; i < totalCombinations && variations.size < limit; i++) {
    let binary = i.toString(2).padStart(cleanUsername.length - 1, '0');
    let newUsername = '';

    for (let j = 0; j < cleanUsername.length; j++) {
      newUsername += cleanUsername[j];
      if (j < cleanUsername.length - 1 && binary[j] === '1') {
        newUsername += '.';
      }
    }

    variations.add(newUsername);
  }

  return Array.from(variations);
}

document.getElementById('generateBtn').onclick = () => {
  const baseInput = document.getElementById('baseName');
  const countInput = document.getElementById('countInput');
  const emailError = document.getElementById('emailError');
  const countError = document.getElementById('countError');

  const base = baseInput.value.trim();
  const count = parseInt(countInput.value);

  let valid = true;

  // Validation
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(base)) {
    baseInput.classList.add('error');
    emailError.style.display = 'block';
    valid = false;
  } else {
    baseInput.classList.remove('error');
    emailError.style.display = 'none';
  }

  if (isNaN(count) || count < 1 || count > 50000) {
    countInput.classList.add('error');
    countError.style.display = 'block';
    valid = false;
  } else {
    countInput.classList.remove('error');
    countError.style.display = 'none';
  }

  if (!valid) return;

  const username = base.split('@')[0].toLowerCase();
  const domain = '@gmail.com';
  const original = base.toLowerCase();

  const rawVariations = generateDotVariations(username, count + 1); // +1 in case original is in list
  const filtered = rawVariations
    .map(u => u + domain)
    .filter(email => email !== original)
    .slice(0, count);

  const finalList = [`Main Gmail: ${original}`, '', ...filtered];
  document.getElementById('mailOutput').value = finalList.join('\n');
  document.getElementById('mailCount').textContent = `Generated: ${filtered.length}`;
};

document.getElementById('copyBtn').onclick = () => {
  const area = document.getElementById('mailOutput');
  area.select();
  document.execCommand('copy');
  alert("Copied to clipboard!");
};

document.getElementById('downloadBtn').onclick = () => {
  const text = document.getElementById('mailOutput').value;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "gmail_variations.txt";
  a.click();
  URL.revokeObjectURL(a.href);
};