module.exports = async (req, res) => {
  const { type } = req.query;

  const allowed = ['pussy', 'cuckold', 'yuri', 'milf', 'blowjob', 'random'];

  if (!allowed.includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    let url;
    if (type === 'random') {
      url = 'https://api-hlgg.onrender.com/';
    } else {
      url = `https://api-rebix.vercel.app/api/nsfw/${type}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('External API error');

    const data = await response.json();

    // Change creator if present
    if (data.creator === 'Samuel-Rebix') data.creator = 'Raven';

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};