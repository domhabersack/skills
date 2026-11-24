import styles from './PricingCards.module.css'

const plans = [
  { name: 'Free', price: '$0', features: ['3 lists', 'Due dates'] },
  { name: 'Pro', price: '$4', features: ['Unlimited lists', 'Recurring tasks', 'API access'] },
]

export function PricingCards() {
  return (
    <div className={styles.grid}>
      {plans.map((plan) => (
        <article key={plan.name} className={styles.card}>
          <h3>{plan.name}</h3>
          <p className={styles.price}>{plan.price}</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
