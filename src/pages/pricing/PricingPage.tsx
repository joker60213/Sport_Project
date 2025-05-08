import { Button } from 'antd'
import styles from './PricingPage.module.scss'

const PricingPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className="container">
      <div className={styles.header}>
        <h2>Выберите тариф</h2>
        <p>Начните с бесплатной версии — 7 дней без ограничений</p>
      </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>1 месяц</h3>
            <p className={styles.price}>499 ₽</p>
            <p>Полный доступ ко всем тренировкам и расписанию</p>
            <Button type="default">Выбрать</Button>
          </div>
          <div className={`${styles.card} ${styles.popular}`}>
            <h3>6 месяцев</h3>
            <p className={styles.price}>2490 ₽</p>
            <p>Экономия и приоритетная поддержка</p>
            <Button type="primary">Самый популярный</Button>
          </div>
          <div className={styles.card}>
            <h3>12 месяцев</h3>
            <p className={styles.price}>4490 ₽</p>
            <p>Максимальная выгода и бонусы для тренеров</p>
            <Button type="default">Выбрать</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
