// public/app.js
document.addEventListener('DOMContentLoaded', async () => {
  const categoryLinksContainer = document.getElementById('categoryLinks')
  const contentContainer = document.getElementById('content')
  const categorySelect = document.getElementById('categoryId')

  // Sækja flokka og búa til tengla
  async function loadCategories() {
    try {
      const response = await fetch('/categories')
      if (!response.ok) {
        throw new Error('Villa við að sækja flokka')
      }
      const categories = await response.json()

      // Hreinsa fyrirliggjandi tengla og dropdown
      categoryLinksContainer.innerHTML = ''
      categorySelect.innerHTML = '<option value="" disabled selected>Veldu flokk</option>'

      // Búa til tengla fyrir hvern flokk og bæta við dropdown
      categories.forEach(category => {
        // Bæta við tengli í navigationsbar
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.href = `#${category.slug}`
        a.textContent = category.name
        a.addEventListener('click', (e) => {
          e.preventDefault()
          loadQuestions(category.id)
        })
        li.appendChild(a)
        categoryLinksContainer.appendChild(li)

        // Bæta við flokk í dropdown listann
        const option = document.createElement('option')
        option.value = category.id
        option.textContent = category.name
        categorySelect.appendChild(option)
      })
    } catch (error) {
      console.error('Villa við að sækja flokka:', error)
    }
  }

  // Sækja spurningar fyrir flokk og birta þær
  async function loadQuestions(categoryId) {
    try {
      const response = await fetch(`/questions?categoryId=${categoryId}`)
      if (!response.ok) {
        throw new Error('Villa við að sækja spurningar')
      }
      const questions = await response.json()

      // Hreinsa fyrirliggjandi efni
      contentContainer.innerHTML = ''

      // Búa til takka til að fara til baka
      const backButton = document.createElement('button')
      backButton.textContent = 'Til baka'
      backButton.addEventListener('click', () => {
        loadCategories()
        contentContainer.innerHTML = ''
      })
      contentContainer.appendChild(backButton)

      // Birta spurningar
      questions.forEach(question => {
        const questionDiv = document.createElement('div')
        questionDiv.className = 'question'
        questionDiv.innerHTML = `
          <h3>${question.question}</h3>
          <ul>
            ${question.answers.map(answer => `
              <li>
                <label>
                  <input type="radio" name="question_${question.id}" value="${answer.id}" data-is-correct="${answer.isCorrect}">
                  ${answer.answer}
                </label>
              </li>
            `).join('')}
          </ul>
          <div id="feedback_${question.id}" class="feedback"></div>
        `
        contentContainer.appendChild(questionDiv)

        // Bæta við event listener fyrir svör
        const radioButtons = questionDiv.querySelectorAll('input[type="radio"]')
        radioButtons.forEach(radio => {
          radio.addEventListener('change', (e) => {
            const isCorrect = e.target.dataset.isCorrect === 'true'
            const feedbackDiv = document.getElementById(`feedback_${question.id}`)
            if (isCorrect) {
              feedbackDiv.textContent = '🎉 Rétt svar! 🎉'
              feedbackDiv.style.color = 'green'
            } else {
              feedbackDiv.textContent = '❌ Rangt svar. Reyndu aftur! ❌'
              feedbackDiv.style.color = 'red'
            }
          })
        })
      })
    } catch (error) {
      console.error('Villa við að sækja spurningar:', error)
    }
  }

  // Búa til spurningu
  const questionForm = document.getElementById('questionForm')
  questionForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const question = document.getElementById('question').value
    const categoryId = parseInt(document.getElementById('categoryId').value)
    const answers = Array.from(document.querySelectorAll('#answers .answer')).map((div, index) => ({
      answer: div.querySelector('input[type="text"]').value,
      isCorrect: div.querySelector('input[type="radio"]').checked,
    }))

    try {
      const response = await fetch('/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, categoryId, answers }),
      })
      if (!response.ok) {
        throw new Error('Villa við að búa til spurningu')
      }
      const newQuestion = await response.json()
      alert(`Spurning búin til: ${newQuestion.question}`)
      location.reload() // Endurhlaða síðu til að sýna nýja spurningu
    } catch (error) {
      console.error('Villa:', error)
    }
  })

  // Byrja með því að sýna flokkana
  loadCategories()
})