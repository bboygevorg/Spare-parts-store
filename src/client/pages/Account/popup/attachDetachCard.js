import React, { Fragment, useState } from 'react';
import AddCard from "pages/Account/addCard";
import classes from './attachDetachCard.css';
import { useCards } from "talons/useCards";
import Loading from 'components/Loading';
import Typo from 'ui/Typo';

const Card = (props) => {
	const { __, card, handleDetachUserCard, detachLoading, selectedUser } = props;
	const [removing, setRemoving] = useState(false);

	const handleRemoveCard = (id, userId) => {
		if(detachLoading || removing) {
			return;
		}
		id === card.id ? setRemoving(true) : setRemoving(false);
		handleDetachUserCard(id, userId);
	}

	return (
		<div className={classes.card}>
			<Typo as="p" variant="px" font="regular">{`**** **** ****${card.last4}`}</Typo>
			<div className={classes.remove}>
				<Typo as="p" variant="px" className={classes.removeCard} onClick={() => handleRemoveCard(card.id, selectedUser.id)}>{__("Remove card")}</Typo>
				<Typo as="p" variant="p">{detachLoading && removing && "..."}</Typo>
			</div>
		</div>
	);
}

const AttachDetachCard = (props) => {
    const { 
		__, 
		isFetchingUserCards, 
		cards, 
		selectedUser, 
		setShouldGetCards,
		handleDetachUserCard,
		detachLoading,
	} = props;
	const [isOpenAdd, setIsOpenAdd] = useState(false);
	const {
		isOpenCardError,
		addNewCard,
		isSubmiting,
		name,
		setName,
		errMessage
    } = useCards({ id: selectedUser.id, setCustomerId: setShouldGetCards, setIsOpenAdd });

	return (
        <div className={classes.root}>
			{!isOpenAdd ?
				<Fragment>
					{isFetchingUserCards ?
						<div className={classes.loadingWrapper}>
							<Loading classes={{ring: classes.loading, root: classes.loadingRoot}}/>
						</div>
					:
						cards.length 
					?
						<div className={classes.removeSection}>
							<Typo as="h2" variant="h2" className={classes.title}>{__("Manage payment methods")}</Typo>
							<div className={classes.cardList}>
								{cards.map((card, i) => 
									<Card
										key={i}
										__={__}
										card={card}
										handleDetachUserCard={handleDetachUserCard}
										detachLoading={detachLoading}
										selectedUser={selectedUser}
									/>
								)}
							</div>
						</div>
					:
						null
					}
					{cards.length ?
						<Typo as="p" variant="p" className={classes.addNew} onClick={() => setIsOpenAdd(true)}>
							+ {__("Add new card")}
						</Typo>
					:
						null
					}
				</Fragment>
			: 
				null
			}
			
            {cards.length && isOpenAdd || !cards.length && !isFetchingUserCards ? 
				<div>
					<AddCard
						submit={addNewCard}
						name={name}
						setName={setName}
						isSaving={isSubmiting}
						errMessage={isOpenCardError ? errMessage ? errMessage : __("Your card was declined") : ""}
						title="inAttachDetach"
					/>
					{cards.length ? 
						<div className={classes.back} onClick={() => { setName(""); setIsOpenAdd(false)}}>
							<span className={classes.backIcon}></span>
							<Typo as="p" variant="p">{__("Back")}</Typo>
						</div>
					:
						null
					}
				</div>
			:
				null
			}
        </div>
    );
}

export default AttachDetachCard;